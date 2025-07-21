CarrierWave.configure do |config|
  # Use local storage for development
  config.storage = :file
  
  # Increase security by restricting file types
  config.validate_integrity = true
  config.validate_processing = true
  
  # Set permissions for uploaded files
  config.permissions = 0644
  config.directory_permissions = 0755
  
  # For production, you might want to use cloud storage like AWS S3
  # config.storage = :fog
  # config.fog_credentials = {
  #   provider: 'AWS',
  #   aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  #   aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  #   region: ENV['AWS_REGION']
  # }
  # config.fog_directory = ENV['S3_BUCKET_NAME']
  # config.fog_public = false
  # config.fog_authenticated_url_expiration = 600
end