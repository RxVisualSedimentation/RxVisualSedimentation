requirejs(["../ext/jquery/dist/jquery.min",
        "../ext/bootstrap/dist/js/bootstrap.min",
        "../ext/rxjs/dist/rx.all.min",
        "../ext/d3/d3.min",
        "./vs"],
    function ($, bootstrap, rx, d3, vs) {
        console.log(vs);
        init();
    });
