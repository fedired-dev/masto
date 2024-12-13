# frozen_string_literal: true

require 'active_support/core_ext/integer/time'

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  # Ensures that a master key has been made available in ENV["RAILS_MASTER_KEY"], config/master.key, or an environment
  # key such as config/credentials/production.key. This key is used to decrypt credentials (and other encrypted files).
  # config.require_master_key = true

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = false

  # Disable serving static files from `public/`, relying on NGINX/Apache to do so instead.
  # config.public_file_server.enabled = false

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.asset_host = ENV['CDN_HOST'] if ENV['CDN_HOST'].present?

  # Specifies the header that your server uses for sending files.
  config.action_dispatch.x_sendfile_header = ENV['SENDFILE_HEADER'] if ENV['SENDFILE_HEADER'].present?
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for Apache
  # config.action_dispatch.x_sendfile_header = "X-Accel-Redirect" # for NGINX

  # Allow to specify public IP of reverse proxy if it's needed
  config.action_dispatch.trusted_proxies = ENV['TRUSTED_PROXY_IP'].split(/(?:\s*,\s*|\s+)/).map { |item| IPAddr.new(item) } if ENV['TRUSTED_PROXY_IP'].present?

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  # Can be used together with config.force_ssl for Strict-Transport-Security and secure cookies.
  # config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true
  # Skip http-to-https redirect for the default health check endpoint.
  config.ssl_options = {
    redirect: {
      exclude: ->(request) { request.path.start_with?('/health') || request.headers['Host'].end_with?('.onion') || request.headers['Host'].end_with?('.i2p') },
    },
  }

  # Log to STDOUT by default
  config.logger = ActiveSupport::Logger.new($stdout)
                                       .tap  { |logger| logger.formatter = ::Logger::Formatter.new }
                                       .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

  # Prepend all log lines with the following tags.
  config.log_tags = [:request_id]

  # "info" includes generic and useful information about system operation, but avoids logging too much
  # information to avoid inadvertent exposure of personally identifiable information (PII). If you
  # want to log everything, set the level to "debug".
  config.log_level = ENV.fetch('RAILS_LOG_LEVEL', 'info')

  # Use a different cache store in production.
  config.cache_store = :redis_cache_store, REDIS_CONFIGURATION.cache

  # Use a real queuing backend for Active Job (and separate queues per environment).
  # config.active_job.queue_adapter = :resque
  # config.active_job.queue_name_prefix = "fedired_production"

  # Disable caching for Action Mailer templates even if Action Controller
  # caching is enabled.
  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  # This setting would typically be `true` to use the `I18n.default_locale`.
  # Some locales are missing translation entries and would have errors:
  # https://github.com/fedired/fedired/pull/24727
  config.i18n.fallbacks = [:en]

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # Better log formatting
  config.lograge.enabled = true

  config.lograge.custom_payload do |controller|
    { key: controller.signature_key_id } if controller.respond_to?(:signed_request?) && controller.signed_request?
  end

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false
  config.action_mailer.perform_caching = false

  # E-mails
  outgoing_email_address = ENV.fetch('SMTP_FROM_ADDRESS', 'notifications@localhost')
  outgoing_email_domain  = Mail::Address.new(outgoing_email_address).domain

  config.action_mailer.default_options = {
    from: outgoing_email_address,
    message_id: -> { "<#{Mail.random_tag}@#{outgoing_email_domain}>" },
  }

  config.action_mailer.default_options[:reply_to]    = ENV['SMTP_REPLY_TO'] if ENV['SMTP_REPLY_TO'].present?
  config.action_mailer.default_options[:return_path] = ENV['SMTP_RETURN_PATH'] if ENV['SMTP_RETURN_PATH'].present?

  enable_starttls = nil
  enable_starttls_auto = nil

  case ENV['SMTP_ENABLE_STARTTLS']
  when 'always'
    enable_starttls = true
  when 'never'
    enable_starttls = false
  when 'auto'
    enable_starttls_auto = true
  else
    enable_starttls_auto = ENV['SMTP_ENABLE_STARTTLS_AUTO'] != 'false'
  end

  config.action_mailer.smtp_settings = {
    port: ENV['SMTP_PORT'],
    address: ENV['SMTP_SERVER'],
    user_name: ENV['SMTP_LOGIN'].presence,
    password: ENV['SMTP_PASSWORD'].presence,
    domain: ENV['SMTP_DOMAIN'] || ENV['LOCAL_DOMAIN'],
    authentication: ENV['SMTP_AUTH_METHOD'] == 'none' ? nil : ENV['SMTP_AUTH_METHOD'] || :plain,
    ca_file: ENV['SMTP_CA_FILE'].presence || '/etc/ssl/certs/ca-certificates.crt',
    openssl_verify_mode: ENV['SMTP_OPENSSL_VERIFY_MODE'],
    enable_starttls: enable_starttls,
    enable_starttls_auto: enable_starttls_auto,
    tls: ENV['SMTP_TLS'].presence && ENV['SMTP_TLS'] == 'true',
    ssl: ENV['SMTP_SSL'].presence && ENV['SMTP_SSL'] == 'true',
    read_timeout: 20,
  }

  config.action_mailer.delivery_method = ENV.fetch('SMTP_DELIVERY_METHOD', 'smtp').to_sym

  config.action_dispatch.default_headers = {
    'Server' => 'Fedired',
    'X-Frame-Options' => 'DENY',
    'X-Content-Type-Options' => 'nosniff',
    'X-XSS-Protection' => '0',
    'Referrer-Policy' => ENV['ALLOW_REFERRER_ORIGIN'] == 'true' ? 'origin' : 'same-origin',
  }

  # TODO: Remove once devise-two-factor data migration complete
  config.x.otp_secret = if ENV['SECRET_KEY_BASE_DUMMY']
                          SecureRandom.hex(64)
                        else
                          ENV.fetch('OTP_SECRET')
                        end

  # Enable DNS rebinding protection and other `Host` header attacks.
  # config.hosts = [
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }
end