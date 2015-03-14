json.(@quiz, :id, :progress, :score, :questions)

json.extract! @quiz, :id, :progress, :score, :region_id

json.questions @quiz.questions do |question|
  json.extract! question, :id, :quiz_id, :answered, :correct,
                          :correct_answer, :answer_a,
                          :answer_b, :answer_c
end
