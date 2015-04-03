class CreateServiceStatistics < ActiveRecord::Migration
  def change
    create_table :service_statistics do |t|
    	t.string :service_id
    	t.integer :count

    	t.timestamps
    end
  end
end
