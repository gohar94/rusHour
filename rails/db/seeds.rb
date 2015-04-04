# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

admins = [{:username => 'admin', :password => 'admin'}]

admins.each do |admin|
	Admin.create(admin)
end

service_admins = [{:username => 'yum_admin', :password => 'yum_admin', :service_id => '1'}]

service_admins.each do |service_admin|
	ServiceAdmin.create(service_admin)
end

services = 
	[{:name => 'Yum', :address => 'MM Alam Road', :city => 'Lahore', :country => 'Pakistan', :category => 'continental', :latitude => '34', :longitude => '77', :description => 'Excellent chinese food!'}]

services.each do |service|
	Service.create(service)
end