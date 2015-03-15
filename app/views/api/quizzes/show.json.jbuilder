json.(@quiz, :id, :progress, :score, :region)

if @question
  json.question(@question, :id, :quiz_id, :answered, :correct,
                           :correct_answer, :answer_a,
                           :answer_b, :answer_c)
end
