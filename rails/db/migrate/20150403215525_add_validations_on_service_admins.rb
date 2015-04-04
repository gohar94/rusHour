class AddValidationsOnServiceAdmins < ActiveRecord::Migration
  change_table :service_admins do |t|
    t.change :username, :string, {limit: 50}
  end
end
