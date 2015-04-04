class Admin < ActiveRecord::Base
	has_secure_password
	scope :sorted, lambda { order("service_admins.username ASC") }
end
