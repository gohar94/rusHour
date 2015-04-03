class ServiceAdminsController < ApplicationController

	def index
		@users = User.sorted
		authorize_admin()
	end

	def show
		
	end

	def user_home
    # displays the public user's panel
    # redirect_to(:controller => "users", :action => "show", :id => session[:id])
    @user = User.find(session[:id])
    @reports = Report.find_reports_by_author(@user.id)
	end

end
