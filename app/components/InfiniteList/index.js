import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList, ActivityIndicator, TextInput } from 'react-native'
import { List } from 'native-base'
import { SearchBar } from 'react-native-elements'

import { API_PAGE_LIMIT } from '../../constants'

export default class InfiniteList extends Component {
    constructor() {
        super()

        this.state = {
            refreshing: false,
            loading: false,
            offset: 0,
            data: [],
            error: null,
            search: null
        }

        this._requestData.bind(this)
    }

    componentWillMount() {
        this.results_count = 0
        this.results_fullcount = 0
        this._requestData()
    }

    _requestData() {
        if (this.state.loading)
            return null
        
        this.setState({ loading: true })

        this.props.getData(this.state.offset, API_PAGE_LIMIT) //this.props.limit)
            .then( res => {
                this.results_count = res.headers.results_count
                this.results_fullcount = res.headers.results_fullcount

                this.setState(prevState => {
                    return {
                        data: prevState.offset === 0 ? res.results : [ ...prevState.data, ...res.results ],
                        error: res.error_message || null,
                        offset: prevState.offset + this.results_count - 1,
                        loading: false,
                        refreshing: false,
                        error: null
                    }
                })
            })
            .catch( error => {
                console.log(error.message)
                this.setState({ error: error.message, loading: false, refreshing: false })
            })
    }

    _handleLoadMore = () => {
        if (!this.state.loading && this.state.offset + 1 < this.results_fullcount) {
            this.setState(prevState => {
                return {
                    offset: prevState.offset + 1
                }
            }, () => {
                this._requestData()
            })
        }
    }

    _handleRefresh = () => {
        this.setState(prevState => {
            return {
                offset: 0,
                refreshing: true
            }
        }, () => {
            this._requestData()
        })
    }

    _search() {
        // Set loading to true when the search starts to display a Spinner
        // this.setState({
        //     loading: true
        // });
        console.log('InfiniteList', '_search')
    }

    _keyExtractor = (item, index) => item.id || item._id

    _renderHeader = () => {
        return (
            <SearchBar
                lightTheme
                clearIcon
                round
                onChangeText={ this._search }
                placeholder={ this.props.searchHolder || 'Type here...' } />
        )
    }

    _renderFooter = () => {
        if ( this.state.loading )
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator animating size='large'/>
                </View>
            )

        return null
    }

    _renderItem = ( { item, index } ) => {
        if (this.state.error) {
            return (
                <View>
                    <Text style={{ color: 'red' }}>{ this.state.error.message }</Text>
                </View>
            )
        }

        return this.props.renderItem(item, index)
    }

    _getItemLayout = (data, index) => {
        const SEARCH_HEADER_HEIGHT = 50
        const { rowHeight } = this.props

        return {
            offset: SEARCH_HEADER_HEIGHT + (rowHeight * index),
            length: rowHeight,
            index 
        }
    }

    render() {
        return (
            // <List contentContainerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            //<View onLayout={ this._handleOnLayout.bind(this) } style={ styles.container }>
                <FlatList
                    data={ this.state.data }
                    renderItem={ this._renderItem }
                    key={ this.props.listKey || 'xs123qwa12s' }
                    //initialNumToRender={ API_PAGE_LIMIT }
                    keyExtractor={ this._keyExtractor }
                    getItemLayout={ this._getItemLayout }
                    ListHeaderComponent={ this._renderHeader }
                    ListFooterComponent={ this._renderFooter }
                    onEndReached={ this._handleLoadMore }
                    onEndReachedThreshold={ 0.50 }
                    refreshing={ this.state.refreshing }
                    onRefresh={ this._handleRefresh }
                    removeClippedSubviews={ true }
                    numColumns={ this.props.columns || 1 }
                />
            //</View>
            // </List>
        )
    }
}

InfiniteList.propTypes = {
    getData: PropTypes.func.isRequired,
    //limit: PropTypes.number.isRequired,
    listKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    columns: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    rowHeight: PropTypes.number.isRequired,
    searchHolder: PropTypes.string.isRequired,
    searchIcon: PropTypes.string
}