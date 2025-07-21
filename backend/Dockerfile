# Use Ruby 3.3 as base image
FROM ruby:3.3

# Set environment variables
ENV BUNDLER_VERSION=2.6.9

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential git curl nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install specific bundler version and gems
RUN gem install bundler:$BUNDLER_VERSION && \
    bundle config set --global ssl_verify_mode 0 && \
    bundle config set --global frozen false && \
    bundle config set path 'vendor/bundle' && \
    bundle install --jobs 4 --retry 3

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Rails server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]