class AddValidationsOnAdmins < ActiveRecord::Migration
  change_table :admins do |t|
    t.change :username, :string, {limit: 50}
  end
end
