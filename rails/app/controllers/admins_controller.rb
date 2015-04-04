class AdminsController < ApplicationController

	layout "dashboard"

	before_action :admin_logged_in?, :except => [:login, :index, :new]
	helper_method :admin_logged_in?

	def index
		if session[:admin]
			redirect_to(:action => "home")
		end
		@admins = Admin.sorted
	end

	def home
		@admin = Admin.find(session[:id])
		@services = Service.all
		@service_admins = ServiceAdmin.all
		@admins = Admin.all
	end

	def login		
		if params[:username].present? && params[:password].present?
			found_user = Admin.where(:username => params[:username]).first
			if found_user
				authorized_user = found_user.authenticate(params[:password])
			end
		end

		if authorized_user
			reset_session
	    session[:id] = authorized_user.id
	    session[:username] = authorized_user.username
	    session[:admin] = true
      flash[:notice] = "You are now logged in!"
      redirect_to(:action => "home")
	  else
			flash[:notice] = "Invalid username/password."
			redirect_to(:action => "index")
		end
	end

	def logout
    reset_session
    flash[:notice] = "Logged out!"
    redirect_to(:action => "index")
  end

	def show
		@admin = Admin.find(params[:id])
	end

	def new
		@admin = Admin.new
	end

	def create
		# passwords from the input form must match
		if params[:admin][:password] != params[:admin][:password_confirm]
			flash[:notice] = "Passwords don't match!"
			redirect_to(:action => 'new')
			return
		end
		
		@admin = Admin.new(admin_params)
		if @admin.save
			flash[:notice] = "Admin created successfully!"
			redirect_to(:action => 'index')
		else
			flash[:notice] = "Admin could not be created."
			redirect_to(:action => 'new')
		end
	end

	def update
		@admin = Admin.find(params[:id])
		if @admin.update_attributes(admin_params)
			flash[:notice] = "Admin updated successfully!"
			redirect_to(:action => 'show', :id => @admin.id)
		else
			render('edit')
		end
	end

	def edit
		@admin = Admin.find(params[:id])
	end

	def destroy
		@admin = Admin.find(params[:id]).destroy
		# if admin is deleting his own account
		if session[:id] == @admin.id
			reset_session
		end
		flash[:notice] = "Admin '#{@admin.username}' deleted successfully!"		
		redirect_to(:action => 'index')
	end

	private

	def admin_logged_in?
		# global admin (admin) must be logged in
    unless session[:admin] == true
      flash[:notice] = "Please log in."
      redirect_to(:action => "index")
      return false
    else
      return true
    end
  end

	def admin_params
		params.require(:admin).permit(:username, :image_path, :password)
	end

end
