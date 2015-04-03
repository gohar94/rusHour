class CreateServices < ActiveRecord::Migration
  def change
    create_table :services do |t|
    	t.string :name
    	t.string :address
    	t.string :city
    	t.string :country
    	t.float :latitude
    	t.float :longitude
    	t.string :category
    	t.string :description
    	
    	t.timestamps
    end
  end
end
