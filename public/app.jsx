function formatHeroName(name){
    return name.toLowerCase().replace(/ /g,"").replace(/'/g,"").replace(/\./g,"")
}
var BuildItem = React.createClass({
    select: function(){
        this.props.selectBuild(this.props.build);
    },
    render: function(){
        return (
            <div className="buildItem" onClick={this.select}>
                <div className="gamesPlayed">
                    <div className="label">
                        Games Played
                    </div>
                    <div className="data">
                        {this.props.build.gamesPlayed}
                    </div>
                </div>
                <div className="winpercent">
                    <div className="label">
                        Win Percent
                    </div>
                    <div className="data">
                        {this.props.build.winPercent}
                    </div>
                </div>
            </div>
        );
    },
});

var HeroItem = React.createClass({
    render: function(){
        return (
            <div className="listItem" onClick={this.viewBuilds}>
                {this.props.hero}
            </div>
        );
    },
    viewBuilds: function(){
        var hero = formatHeroName(this.props.hero);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open("GET", "/builds/"+hero+".json", true);
        xhr.onreadystatechange = function(){
            if (this.readyState==4 && this.status==200){
                self.props.selectHero(JSON.parse(this.responseText));
            }
        }
        xhr.send();
    }
});

var BuildList = React.createClass({
    render: function(){
        var self = this;
        var createCard = function(build, index) {
            return <BuildItem build={build} selectBuild={self.props.selectBuild} key={index} />
        };
        return (
            <div className="buildList">
                {this.props.builds.map(createCard)}
            </div>
        );
    }
});

var HeroList = React.createClass({
    render: function(){
        var self = this;
        var createCard = function(hero, index) {
            return <HeroItem hero={hero} key={index} selectHero={self.props.selectHero} />
        };
        return (
            <div className="heroList">
                {this.props.heroes.map(createCard)}
            </div>
        );
    }
});

var BackButton = React.createClass({
    render: function(){
        return (
            <div className="backButton" onClick={this.props.backAction}>
                {this.props.backLabel}
            </div>
        );
    }
});

var TopNav = React.createClass({
    render: function(){
        var backButton;
        if(this.props.backLabel){
            backButton = <BackButton backLabel={this.props.backLabel} backAction={this.props.backAction}/>;
        }

        return (
            <div className="listItem topNav">
                {backButton}
                <div className="pageTitle">
                    {this.props.pageTitle}
                </div>
            </div>
        );
    }
});


var Talent = React.createClass({
    render: function(){
        return (
            <div className="talent">
            <div className="name">
                {this.props.talent.name}
            </div>
            <div className="desc">
                {this.props.talent.desc}
            </div>
            </div>
        );
    }
});


var BuildGuide = React.createClass({
    getInitialState: function(){
        return { currTalent: this.props.build.talents[0] };
    },
    showTalent: function(talent){
        this.setState({
            currTalent: talent
        });
    },
    render: function(){
        var self = this;
        var choice = function(talent, index){
            return (
                <div className="choice" onClick={self.showTalent.bind(self,talent)}>
                    <img src={talent.img} />
                </div>
            );
        };
        return (
            <div className="buildGuide">
            <div className="leftView">
                <TopNav pageTitle="Build Guide" backLabel="Builds" backAction={this.props.backAction}/>
                <Talent talent={this.state.currTalent} />
            </div>
            <div className="rightView">
                {this.props.build.talents.map(choice)}
            </div>
            </div>
        );
    }
});

var UI = React.createClass({
    getInitialState: function(){
        return { view: "heroSelect" };
    },
    selectHero: function(builds){
        this.setState({
            view: "buildSelect",
            builds: builds
        });
    },
    selectBuild: function(build){
        this.setState({
            view: "buildGuide",
            build: build
        });
    },
    initState: function(){
        this.setState({
            view: "heroSelect"
        });
    },
    buildSelectState: function(){
        this.setState({
            view: "buildSelect"
        });
    },

    render: function(){
        switch(this.state.view){
            case "heroSelect":
                return (
                    <div>
                        <TopNav pageTitle="Select a Hero" />
                        <HeroList heroes={heroes} selectHero={this.selectHero}/>
                    </div>
                );
                break;
            case "buildSelect":
                return (
                    <div>
                        <TopNav pageTitle="Select a Build" backLabel="Heroes" backAction={this.initState}/>
                        <BuildList builds={this.state.builds} selectBuild={this.selectBuild}/>
                    </div>
                );
                break;
            case "buildGuide":
                return (
                    <div>
                        <BuildGuide build={this.state.build} backAction={this.buildSelectState}/>
                    </div>
                );
                break;
        }
    }
});

React.render(
    <UI />,
    document.querySelector("#ui")
);

