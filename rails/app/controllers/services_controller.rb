class ServicesController < ApplicationController

	layout "application"

	def index
	  @services = Service.all
	end

	def show
	  @service = Service.find(params[:id])
	end

	def find
		@services = Service.search(params[:query])
	end

	def create
		@service = Service.new(service_params)
		if @service.save
			flash[:notice] = "#{@service.name} was successfully added to the RusHour database!"
			redirect_to service_path(@service)
		else
			flash[:notice] = "Could not create the service. Please try again."
			redirect_to services_path
		end
	end

	def edit
		authorized?
		@service = Service.find(params[:id])
	end

	def update
		authorized?
		@service = Service.find(params[:id])
		if @service.update_attributes(service_params)
			flash[:notice] = "Service updated successfully!"
			redirect_to(:action => 'show', :id => @service.id)
		else
			render('edit')
		end
	end

	def destroy
		authorized?
		@service = Service.find(params[:id]).destroy
		flash[:notice] = "Service '#{@service.id}' deleted successfully!"		
		redirect_to(:action => 'index')
	end

	private

	def authorized?
		unless session[:admin] || (session[:service_admin] && params[:id].to_s == session[:service_id].to_s)
			flash[:notice] = "You don't have permission to perform this action."
			if request.env['HTTP_REFERER']
				redirect_to(:back)
			else
				redirect_to(:controller => 'welcome', :action => 'index')
			end
		end
	end

	def service_params
		params.require(:service).permit(:name, :address, :city, :country, :latitude, :longitude, :description, :category)
	end

end