class County < ActiveRecord::Base
  validates :name, :code, :state, :country, presence: true, uniqueness: true

end
