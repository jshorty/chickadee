class Bird < ActiveRecord::Base
  validates :common_name, :scientic_name, presence: true, uniqueness: true

  def genus
    self.scientific_name.split(" ")[0]
  end

  def species
    self.scientific_name.split(" ")[1]
  end

  def subspecies
    names = self.scientific_name.split(" ")
    names.length > 2 ? names[2] : nil
  end
  
end
