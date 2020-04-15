import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Card, CardBody, Button, Row, Col, Modal, ModalBody} from 'reactstrap'
import Inventory from './Inventory';
import characterImage from '../Images/Character1.png'
import './PlayerStyles.css'
// import axios from 'axios';

class Player extends React.Component{

constructor(props){
super(props)
this.state = {
    PlayerStats: this.props.PlayerStats,   
    

    Equipped:{
        LHANDWEP: {},
        RHANDWEP: {},
        HANDS: {},
        FEET: {},
        LEGS: {},
        CHEST: {},
        HEAD: {}
    },

    items: [],
    player: [],
    givenPoints: 10,
    toggleModal: false,
}
}

componentDidMount(){
    this.calculateLevelUpExp(this.state.PlayerStats) 
    // axios.get('api/player/1' )
    // .then(res => {
    //     const player = res.data;
    //     this.setState({player})
    // })
}

testApiCall = async() => {

}

plusStat = (area) => {
    var stats = this.state.PlayerStats;
    var points = this.state.givenPoints;

    if(points > 0)
    {
    stats[area] = stats[area] + 1
    points = points - 1
    this.setState({givenPoints: points}, this.calculateBaseStats(stats, "plus"))
    }
}

minusStat = (area) => {
    var stats = this.state.PlayerStats;
    var points = this.state.givenPoints;

    if(stats[area] !== 0)
    {
    stats[area] = stats[area] - 1
    points = points + 1
    this.setState({givenPoints: points}, this.calculateBaseStats(stats, "minus"))
    }
}

calculateBaseStats = (stats, minusPlus) => {
  
    stats.ATK = stats.STR * 2 + stats.INT * 0.25;
    stats.MAXHEALTH = 100 + (stats.STM * 20) + (stats.STR * 10 / 2);
    stats.WATK = stats.INT * 2 + stats.STR * 0.25
 
    this.setState({PlayerStats: stats})

}

plusMinus = (area) => {
    if(this.state.givenPoints > 0)
    {
    return(
        <div className="PlusMinus" style={{display: "flex"}}>
        <div onClick={() => this.plusStat(area)}>
            <FontAwesomeIcon icon="plus" />
        </div>
        {this.state.givenPoints}
        <div onClick={() => this.minusStat(area)}>
            <FontAwesomeIcon icon="minus" />
        </div>
        </div>    
        )
    }
}

calculateLevelUpExp = (stats) => {
    stats.expLimit = stats.LVL * 100
    this.setState({PlayerStats: stats})
}

 upDatePlayer = (damage, cash, exp, item) => {
     var player = this.state.PlayerStats
     player.HEALTH = player.HEALTH - damage;
     player.CASH = player.CASH + cash;
     player.EXP = player.EXP + exp;
    if(player.HEALTH <= 0)
    {
        this.killPlayer()
    }
     this.setState({PlayerStats: player})
}

useItem = (health) => {
    var player = this.state.PlayerStats
    var itemList = this.state.items;
    itemList.splice(itemList.length - 1, 1)
    player.HEALTH = player.HEALTH + health;
    if(player.HEALTH > player.MAXHEALTH)
    {
        player.HEALTH = player.MAXHEALTH;
    }
    this.setState({PlayerStats: player, items: itemList})
}

givePlayerItem = (item, cost) => {
    var player = this.state.PlayerStats;
    var itemList = this.state.items;
    if(player.CASH < cost)
    {

    }
    else
    {
    player.CASH = player.CASH - cost;
    itemList.push(item);
    this.setState({items: itemList})
    }
}

killPlayer = () => {
    this.setState({toggleModal: true})
}

levelUp = () => {
    var points = this.state.givenPoints;
    var stats = this.state.PlayerStats;
    stats.EXP = stats.EXP - stats.expLimit;
    stats.LVL = stats.LVL + 1;
    points = points + 3;
    this.setState({givenPoints: points}, this.calculateLevelUpExp(stats))
}

checkForLevelUp = () => {
    console.log("firing")
    var player = this.state.PlayerStats;
    console.log(player)
    if(player.EXP >= player.expLimit)
    {
        this.levelUp()
    }
}

render(){
  this.checkForLevelUp()
    return(
        <div>
        <Card style={{fontSize: "medium", color: "black", backgroundColor: "darkblue", width: 300}}>
        <CardBody>
            <Row>
            <Col className="PlayerProfileImage" xs="auto">
            <p style={{marginBottom: 0}}>{this.state.PlayerStats.Name}</p>
            <img width={128} height={128} src={characterImage} alt="error"></img>
            </Col>
            <Col className="AttributeWindow" sm="5">
            <div className="Attribute">
            {this.plusMinus("STR")}STR: {this.state.PlayerStats.STR}
            </div>
            <div className="Attribute">
            {this.plusMinus("INT")}INT: {this.state.PlayerStats.INT}
            </div>
            <div className="Attribute">
            {this.plusMinus("STM")}STM: {this.state.PlayerStats.STM}
            </div>
            </Col>
            </Row>
            <Row>
            <Col className="PlayerStats">
            <p>LEVEL: {this.state.PlayerStats.LVL}</p>
            <p>EXP: {this.state.PlayerStats.EXP}/{this.state.PlayerStats.expLimit}</p>
            <p>DMG MELEE: {this.state.PlayerStats.ATK}</p>
            <p>DMG WEAPON: {this.state.PlayerStats.WATK}</p>
            <p>HEALTH: {this.state.PlayerStats.HEALTH}/{this.state.PlayerStats.MAXHEALTH}</p>
            <p>CASH: ¥{this.state.PlayerStats.CASH}</p>
            </Col>
            {/* <Button onClick={() => this.levelUp()}>LVL UP</Button> */}
            </Row>
            <Row>
            <Inventory Items={this.state.items} useItem={this.useItem}/>
            </Row>
        </CardBody>
        </Card>
        <Modal isOpen={this.state.toggleModal}>
        <ModalBody>
            You are dead.
            <Button onClick={() => window.location.reload()}>OK</Button>
        </ModalBody>
        </Modal>
        </div>
    )
}




}
export default Player