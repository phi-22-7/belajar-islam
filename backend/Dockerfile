# Use Ruby official image
FROM ruby:3.3

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Copy Gemfile and install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]