import React, { Component } from 'react'
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { Text, Icon } from 'native-base'

import { SCREEN_SONGS_COLOR } from '../../constants'

export default class TracksListItem extends React.PureComponent {
    _onPressItem = (index , listItem) => {
        this.props.playSong(index , listItem)
    }

    _onRightPressItem = (listItemId) => {
        this.props.shareTrack(listItemId)
    }

    render () {
        const { listItem, index, size, selected } = this.props

        return (
            <View style={{ height: size, marginVertical: 5, paddingHorizontal: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                <TouchableWithoutFeedback onPress={ () => this._onPressItem(index , listItem) }>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <ImageBackground source={{ uri: listItem.image }} style={[ { width: size, height: size }, styles.background] }>
                            <View style={ styles.playButtonOverlay }>
                                <Icon name="ios-play" style={{ color: "rgba(255, 255, 255, 0.7)", marginLeft: 4 }}/>
                            </View>
                        </ImageBackground>
                        <View style={{ marginLeft: 10, paddingRight: 15, flex: 1, borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                            <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                            <Text numberOfLines={ 1 } note>{ listItem.album_name }</Text>
                            <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={ () => this._onRightPressItem(`${listItem.id}`) }>
                    <View style={{ height: "100%", justifyContent:"center", borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                        <Text style={ styles.actionButtonText }>{"wave\nme"}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        justifyContent: "center",
        alignItems: "center"
    },
    playButtonOverlay: {
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    actionButtonText: {
        marginRight: 10,
        fontSize: 12,
        textAlign: "center",
        color: SCREEN_SONGS_COLOR
    }
})