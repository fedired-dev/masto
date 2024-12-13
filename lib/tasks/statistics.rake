# frozen_string_literal: true

task stats: 'fedired:stats'

namespace :fedired do
  desc 'Report code statistics (KLOCs, etc)'
  task :stats do
    require 'rails/code_statistics'
    [
      ['App Libraries', 'app/lib'],
      %w(Presenters app/presenters),
      %w(Policies app/policies),
      %w(Serializers app/serializers),
      %w(Services app/services),
      %w(Validators app/validators),
      %w(Workers app/workers),
    ].each do |name, dir|
      STATS_DIRECTORIES << [name, dir]
    end
  end
end
