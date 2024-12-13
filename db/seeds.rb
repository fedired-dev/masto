# frozen_string_literal: true

Chewy.strategy(:fedired) do
  Rails.root.glob('db/seeds/*.rb').each do |seed|
    load seed
  end
end
