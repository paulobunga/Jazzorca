import React, { Component, ComponentProps, LegacyRef, Ref } from 'react'
import { FlatList, LayoutChangeEvent } from 'react-native'
import { connect } from 'react-redux'
import { skip } from '../store/actions'
import JOTitle from './Elements/JOTitle'
import TrackList from './Elements/TrackList'
import Screen from './Screen'
import { Track } from 'react-native-track-player'

interface QueueProps extends ComponentProps<any> {

}

class Queue extends Component<QueueProps> {
    state: {
        tracklistHeight: number
    }
    scrollView: FlatList<Track> | undefined

    constructor(props: QueueProps) {
        super(props)
        this.state = {
            tracklistHeight: 0
        }
        this.scrollView = undefined
    }
    _getBottomPadding() {
        if (this.state.tracklistHeight !== undefined) {
            const { queue, currentTrack } = this.props;
            if (currentTrack !== undefined) {
                const currentIndex = queue.findIndex((t: Track) => t.id === currentTrack.id)
                const tracksRemainingCount = queue.length - currentIndex
                return this.state.tracklistHeight - tracksRemainingCount * 80
            }
        }
    }

    componentDidMount() {
        if (this.scrollView !== undefined)
            this.scrollView.scrollToEnd({ animated: true })
    }

    componentDidUpdate() {
        const { queue, currentTrack } = this.props;
        if (currentTrack !== undefined) {
            const currentIndex = queue.findIndex((t: Track) => t.id === currentTrack.id)
            if (currentIndex >= queue.length - 2 && this.scrollView !== undefined) {
                this.scrollView.scrollToEnd({ animated: true });
            }
        }
    }

    render() {
        return (
            <Screen>
                <JOTitle>File d'attente</JOTitle>
                <TrackList
                    forwardRef={(ref: FlatList<Track>) => { this.scrollView = ref }}
                    data={this.props.queue}
                    onPress={(track: Track) => skip(track.id)}
                    keyExtractor={(track: Track) => track.id}
                    ListFooterComponentStyle={{ height: this._getBottomPadding() }}
                    onLayout={({ nativeEvent }: LayoutChangeEvent) => this.setState({ tracklistHeight: nativeEvent.layout.height })}
                    currentTrackChecker={(track: Track, currentTrack: Track) => track.id === currentTrack.id}
                />
            </Screen>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        queue: state.playerState.queue,
        currentTrack: state.playerState.currentTrack
    }
}

export default connect(mapStateToProps)(Queue)