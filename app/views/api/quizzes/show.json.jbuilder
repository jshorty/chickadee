json.(@quiz, :id, :progress, :score, :level, :xp_timeseries, :region, :history)

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

if @image
  json.question do
    json.image_url @image.image.url
    json.image_owner @image.owner
    json.image_flickr_url @image.flickr_url
  end
end
