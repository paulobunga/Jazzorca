import React from 'react'
import { connect } from 'react-redux'
import { playNow } from '../store/actions'
import { ytRelatedNextPage } from '../API/YouTubeAPI'
import JOTitle from './Elements/JOTitle'
import Screen from './Screen'
import TrackList from './Elements/TrackList'
import { ContinuationInfos, JOTrack, JOThunkDispatch } from '../helpers/types'
import { filterResults } from '../helpers/utils'
import { RelatedTabNavigationProp } from '../Navigation/Navigation'

interface RelatedProps {
    navigation: RelatedTabNavigationProp,
    dispatch: JOThunkDispatch,
    cache: {
        [videoId: string]: JOTrack
    },
    track: JOTrack
}

class Related extends React.Component<RelatedProps> {
    state: {
        loadingNextPage: boolean,
    }

    constructor(props: RelatedProps) {
        super(props)

        this.state = {
            loadingNextPage: false,
        }
    }

    _onPress(track: JOTrack) {
        const { navigation, dispatch } = this.props
        navigation.navigate('Player')
        return dispatch(playNow(track))
    }

    _loadNextPage() {
        const { track, cache, dispatch } = this.props
        this.setState({ loadingNextPage: true })
        ytRelatedNextPage(cache[track.videoId].related.continuationInfos)
            .then(({ results, continuationInfos }: { results: JOTrack[], continuationInfos: ContinuationInfos }) => {
                dispatch({
                    type: 'ADD_RELATED',
                    value: { results, continuationInfos }
                })

                this.setState({
                    loadingNextPage: false
                })
            })
    }

    _showRelated() {
        const { track, cache } = this.props
        if (track !== undefined && cache[track.videoId] !== undefined)
            return (
                <TrackList
                    data={filterResults(cache[track.videoId].related.results)}
                    onEndReached={() => { this._loadNextPage() }}
                    loadingNextPage={this.state.loadingNextPage}
                    ListFooterComponentStyle={{ height: 40 }}
                    onPress={(track: JOTrack) => this._onPress(track)}
                />

            )
    }

    render() {
        return (
            <Screen>
                <JOTitle>Recommandations</JOTitle>
                {this._showRelated()}
            </Screen>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        track: state.playerState.currentTrack,
        cache: state.playerState.cache
    }
}


export default connect(mapStateToProps)(Related)