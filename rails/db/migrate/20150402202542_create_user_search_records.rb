class CreateUserSearchRecords < ActiveRecord::Migration
  def change
    create_table :user_search_records do |t|
    	t.string :user_id
    	t.string :service_id

    	t.timestamps
    end
  end
end
