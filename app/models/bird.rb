class Bird < ActiveRecord::Base
  validates :common_name, :sci_name, presence: true
  validates :sci_name, uniqueness: true

  has_many :bird_regions,
    class_name: "BirdRegion",
    primary_key: :id,
    foreign_key: :bird_id,
    dependent: :destroy

  has_many :quiz_questions,
    class_name: "Question",
    primary_key: :id,
    foreign_key: :bird_id

  has_many :regions,
    through: :bird_regions,
    source: :region

  has_many :quizzes,
    through: :quiz_questions,
    source: :quiz,
    dependent: :destroy

  def genus
    self.sci_name.split(" ")[0]
  end

  def species
    self.sci_name.split(" ")[1]
  end

  def subspecies
    names = self.sci_name.split(" ")
    names.length > 2 ? names[2] : nil
  end

  def self.quiz_question(region_id)
    BirdRegion.all.where(region_id: region_id).birds.to_a.sample(4)
  end
end
