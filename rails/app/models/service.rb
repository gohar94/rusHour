class Service < ActiveRecord::Base

	# search all services for name or address or city or country or description or category containing query (with wildcard)
	scope :search, lambda {|query|
	  where(["name LIKE ? OR address LIKE ? OR city LIKE ? OR country LIKE ? OR category LIKE ?", 
	  	"%#{query}%", "%#{query}%", "%#{query}%", "%#{query}%", "%#{query}%"])
	}

end