json.(current_user, :id, :email, :alias, :streak_count)

json.image_url image_url(current_user.image.url)
