
var HeroList = React.createClass({
    render: function(){
        var select = this.props.select;
        var createCard = function(hero, index) {
            //return <NewsCard story={story} key={index} select={select}/>
            return <div>{hero.name}</div>
        };
        return (
            <div className="heroList">
                {this.props.heroes.map(createCard)}
            </div>
        );
    }
});

React.render(
    <HeroList heroes
);
