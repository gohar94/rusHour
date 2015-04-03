class CreateServiceAdmins < ActiveRecord::Migration
  def change
    create_table :service_admins do |t|
  		t.string :username
  		t.string :password_digest
  		t.integer :service_id
  		t.string :image_path

      t.timestamps
    end
  end
end