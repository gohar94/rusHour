class AddImageToServices < ActiveRecord::Migration
  def change
    add_column :services, :image_path, :string
  end
end
