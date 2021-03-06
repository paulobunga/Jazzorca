import React, { Component } from 'react'
import { StyleSheet, ViewStyle, StyleProp } from 'react-native'
import JOModal from './JOModal';

interface TrackModalProps {
    autoHide?: number,
    modalStyle?: StyleProp<ViewStyle>,
}

export default class TrackModal extends Component<TrackModalProps> {
    state: {
        modalVisible: boolean,
    }

    modal: JOModal | null

    constructor(props: TrackModalProps) {
        super(props);

        this.state = {
            modalVisible: false
        }

        this.modal = null
    }

    public show() {
        this.modal?.show();
    }

    public hide() {
        this.modal?.hide();
    }

    render() {
        return (
            <JOModal
                modalStyle={this.props.modalStyle}
                ref={(ref) => {
                    this.modal = ref;
                }}
            >
                {this.props.children}
            </JOModal>
        )
    }
}