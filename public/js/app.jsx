var SearchForm = React.createClass({
	getInitialState: function() { return { name: "", phone: "" } },
	handleNameChange: function(e) {
		this.setState({ name: e.target.value });
	},
	handlePhoneChange: function(e) {
		this.setState({ phone: e.target.value });
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var name = this.state.name.trim().toLowerCase();
		var phone = this.state.phone.trim();
		var query = {};
		if (name) query.name = getHash(name);
		if (phone) query.phone = getHash(phone);
		this.props.onSubmit(query);
		this.setState({ name: "", phone: "" });
	},
	render: function() {
		return (
			<form id="signup-form" className="search-form" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Nimi" value={this.state.name} onChange={this.handleNameChange} />
				<input type="text" placeholder="Puhelin (muoto 0501234567)" value={this.state.phone} onChange={this.handlePhoneChange} />
				<input type="submit" value="Hae"/>
			</form>
		);
	}
});

var State = React.createClass({
	render: function() {
		return (
			<div className={ this.props.appState === this.props.showOn ? 'visible' : 'hidden' }>
				{this.props.children}
			</div>
		)
	}
});

function getHash(cleartext) {
	return md5(cleartext.trim().toLowerCase());
}

var Results = React.createClass({
	render: function() {
		return (
			<div>
				<h1>Tuloksia {this.props.num} kappaletta</h1>
			</div>
		)
	}
});

var AppComponent = React.createClass({
	getInitialState: function() { return { appState: "start", results: 0 } },

	handleReset: function(e) {
		this.setState({ appState: "start" });
	},

	doQuery: function(query) {
		this.setState({ appState: "waiting" });
		$.get('api/find', { query: query }, function(data, err) {
			console.log(data);
			this.setState({ results: data.results });
			this.setState({ appState: "results" });
		}.bind(this))
	},

	render: function() {
		return (
			<div>
				<div className={ this.state.appState === 'start' ? 'visible' : 'hidden' }>
					<SearchForm onSubmit={this.doQuery} />
				</div>
				<div className={ this.state.appState === 'waiting' ? 'visible' : 'hidden' }>
					<h1>Odota&hellip;</h1>
				</div>
				<div className={ this.state.appState === 'results' ? 'visible' : 'hidden' }>
					<h1>{this.state.results} hakuosumaa.</h1>
					<button onClick= {this.handleReset}>Uusi haku</button>
				</div>
			</div>
	)
	}
});

ReactDOM.render(
	<AppComponent />,
  document.getElementById('appcontent')
);
