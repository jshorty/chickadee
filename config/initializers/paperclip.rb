Paperclip.interpolates :bird_id do |attachment, style|
  attachment.instance.bird_id.parameterize
end
