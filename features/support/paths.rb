module NavigationHelpers
  def path_to(page_name)
    case page_name
    when /start page/
      "/"
    when /new test result page/
      "#/test_results/new"
    else
      raise "Can't find mapping from \"#{page_name}\" to a path."
    end
  end
end

World(NavigationHelpers)