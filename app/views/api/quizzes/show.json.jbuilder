json.(@quiz, :id, :progress, :score, :xp_timeseries, :region)

if @question
  json.question(@question, :id, :quiz_id, :answered, :correct,
                :correct_answer, :answer_a, :answer_b, :answer_c)
end

if @song
  json.question do
    json.info_url @song.info_url
    json.recordist @song.recordist
    json.audio_url @song.recording.url
  end
end
