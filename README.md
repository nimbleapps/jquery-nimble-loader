jquery-nimble-loader
====================

<h2>jquery-nimble-loader</h2>

<h3>Full description:</h3>

<p>The jquery.nimble.loader plugin will allow you to easy create <strong>loading bar</strong> for any element in your web page.</p>


<strong>1- Define the css style for your loading bar</strong>
<code>
.loading_bar{
	position: absolute;
	display: none;
	height: 100%;
	width: 100%;
	background: transparent url(../images/ajax-loader.gif) no-repeat 50% 50%;
}
</code>
<br>


<strong>2- Parameters the plugins  :</strong>

<code>
var myLoadingParams = {
	loaderClass        : "loading_bar",
	hasBackground      : true
}
$.fn.nimbleLoader.setSettings(myLoadingParams);
</code>
Here loaderClass option is not needed as they reuse default values,<br>
hasBackground will add a background to the loading bar
<br>


<strong>3- To show the loading bar :</strong>
<code>
$("#myElement").nimbleLoader("show");
</code>
<br>

<strong>4- To hide the loading bar :</strong>
<code>
$("#myElement").nimbleLoader("hide");
</code>
<br>

<p><strong>That's all !</strong></p>

<p>
	It's also easy to define different styles for several loading bar. <br />
	Example, if you want to show a specific loading bar with a blue background for your body : <br />
</p>
<code>
	var myBodyLoadingParams = {
		loaderClass        : "loading_bar_body",
		speed              : 700,
		needRelativeParent : false,
		hasBackground      : true,
		backgroundColor    : blue,
		backgroundOpacity  : 0.75
	}
	$("body").nimbleLoader("show", myBodyLoadingParams);
</code>

See examples on <a target="_blank" href="http://www.salesclic.com/jquery.nimble.loader/demo">the web page demo</a>

<h3>Installation:</h3>

<ul>
	<li>Copy jquery.nimble.loader.js in your working directory</li>
	<li>Add the script tag to reference it into your website</li>
</ul>

<h3>More information:</h3>

<p>You will find more information on "how does it work" into the jquery.nimble.loader.js file</p>