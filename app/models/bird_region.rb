class BirdRegion < ActiveRecord::Base
  validates :region_id, :bird_id, presence: true
  validates :bird_id, uniqueness: { scope: :region_id }

  belongs_to :region,
    class_name: "Region",
    primary_key: :id,
    foreign_key: :region_id

  belongs_to :bird,
    class_name: "Bird",
    primary_key: :id,
    foreign_key: :bird_id
end
