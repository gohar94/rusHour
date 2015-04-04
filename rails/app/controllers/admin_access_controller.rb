class AdminAccessController < ApplicationController

	layout "dashboard"
	
	def index
	end
	
	# bug; admin and service admin cant have same username
	def login
		if params[:username].present? && params[:password].present?
			found_user = Admin.where(:username => params[:username]).first
			if found_user
				authorized_user = found_user.authenticate(params[:password])
				user_type = "admin"
			end
			if !found_user
				found_user = ServiceAdmin.where(:username => params[:username]).first
				if found_user
					authorized_user = found_user.authenticate(params[:password])
					user_type = "service_admin"
				end
			end
		end

		if authorized_user
			reset_session
	    session[:id] = authorized_user.id
	    session[:username] = authorized_user.username
	    flash[:notice] = "You are now logged in!"
	    if user_type == "admin"
				session[:admin] = true
	    	redirect_to(:controller => "admins", :action => "home")
	    else
	    	session[:service_admin] = true
	    	session[:service_id] = authorized_user.service_id
	    	redirect_to(:controller => "service_admins", :action => "home")
	    end
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

end
