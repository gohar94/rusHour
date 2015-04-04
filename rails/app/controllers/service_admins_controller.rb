class ServiceAdminsController < ApplicationController

	layout "dashboard"

	before_action :admin_or_service_admin_logged_in?, :except => [:login, :index]
	before_action :admin_has_privelages? => [:new, :create]
	helper_method :admin_or_service_admin_logged_in?

	def index
		if session[:service_admin]
			redirect_to(:action => 'home')
		end
	end

	def home
		@service_admin = ServiceAdmin.find(session[:id])
		@service = Service.find(session[:service_id])
	end

	def show
		authorized?
		@service_admin = ServiceAdmin.find(params[:id])
	end

	def new
		@service_admin = ServiceAdmin.new
	end

	def create
		# passwords from the input form must match
		if params[:service_admin][:password] != params[:service_admin][:password_confirm]
			flash[:notice] = "Passwords don't match!"
			redirect_to(:action => 'new')
			return
		end
		
		@service_admin = ServiceAdmin.new(service_admin_params)
		if @service_admin.save
			flash[:notice] = "Service Admin created successfully!"
			redirect_to(:controller => 'welcome', :action => 'index')
		else
			flash[:notice] = "Service Admin could not be created."
			redirect_to(:action => 'new')
		end
	end

	def update
		authorized?
		@service_admin = ServiceAdmin.find(params[:id])
		if @service_admin.update_attributes(service_admin_params)
			flash[:notice] = "Admin updated successfully!"
			redirect_to(:action => 'show', :id => @service_admin.id)
		else
			render('edit')
		end
	end

	def edit
		authorized?
		@service_admin = ServiceAdmin.find(params[:id])
	end

	def destroy
		authorized?
		@service_admin = ServiceAdmin.find(params[:id]).destroy
		# if admin is deleting his own account
		if session[:id] == @service_admin.id
			reset_session
		end
		flash[:notice] = "Service Admin '#{@service_admin.username}' deleted successfully!"		
		redirect_to(:action => 'index')
	end

	private

	def authorized?
		unless session[:admin] || (session[:service_admin] && params[:id].to_s == session[:id].to_s)
			flash[:notice] = "You don't have permission to perform this action."
			if request.env['HTTP_REFERER']
				redirect_to(:back)
			else
				redirect_to(:controller => 'welcome', :action => 'index')
			end
		end
	end

	def admin_or_service_admin_logged_in?
		# either service admin or the global admin (admin) must be logged in
    unless session[:service_admin] == true || session[:admin] == true
      flash[:notice] = "Please log in."
      redirect_to(:action => "index")
      return false
    else
      return true
    end
  end

	def service_admin_params
		params.require(:service_admin).permit(:username, :image_path, :password, :service_id)
	end

end
