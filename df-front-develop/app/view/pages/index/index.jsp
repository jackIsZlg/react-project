<% extends "../base/layout.jsp" %>
    <% block title %>最新-INS-DeepFashion<% endblock %>
    <% block content %>
            <div id="app">
            <div id="content">
            <div id="pinterest_search"></div>
            <div class="header-labs">
            </div>
            <div class="container index-wrapper">
                    <div id="index-waterfall-query">
                            <div className="water-fall-filter">
                            <div className='selection-container'>
                            </div>
                            </div>
                            <div id="water-fall-panel">
                                <% asyncEach item in resultList %>
                                    <img src="" width="0" height="0"  alt=''>
                                <% endeach %>
                            </div>
                    </div>
            </div>
            <% include "../base/footer.jsp" %>
            </div>
        </div>
    </div>
    </div>

<% endblock %>
