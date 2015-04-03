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
		@service = Service.find(params[:id])
		# authorize_admin_or_author()
	end

	def update
		@service = Service.find(params[:id])
		# authorize_admin_or_author()
		if @service.update_attributes(service_params)
			flash[:notice] = "Service updated successfully!"
			redirect_to(:action => 'show', :id => @service.id)
		else
			render('edit')
		end
	end

	def destroy
		@service = Service.find(params[:id]).destroy
		# authorize_admin_or_author()
		flash[:notice] = "Service '#{@service.id}' deleted successfully!"		
		redirect_to(:action => 'index')
	end

	def service_params
		params.require(:service).permit(:name, :address, :city, :country, :latitude, :longitude, :description, :category)
	end

end