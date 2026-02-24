import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  
  // Observables for state tracking
  private isMutedSubject = new BehaviorSubject<boolean>(false);
  private isCameraOnSubject = new BehaviorSubject<boolean>(true);
  private isScreenSharingSubject = new BehaviorSubject<boolean>(false);

  isMuted$ = this.isMutedSubject.asObservable();
  isCameraOn$ = this.isCameraOnSubject.asObservable();
  isScreenSharing$ = this.isScreenSharingSubject.asObservable();

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // Free Google STUN Server
      ]
    });
    
    this.remoteStream = new MediaStream();
  }

  // ✅ Initialize media devices
  async initializeMedia(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
      return this.localStream;
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      throw error;
    }
  }

  // ✅ Handle Incoming Call
  async handleIncomingCall(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  // ✅ Create an Offer
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  // ✅ Receive and Add Remote Stream
  onTrack(callback: (stream: MediaStream) => void) {
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
      callback(this.remoteStream);
    };
  }

  // ✅ Toggle Mute
  toggleMute(): void {
    this.localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    this.isMutedSubject.next(!this.isMutedSubject.value);
  }

  // ✅ Toggle Camera
  toggleCamera(): void {
    this.localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    this.isCameraOnSubject.next(!this.isCameraOnSubject.value);
  }

  // ✅ Toggle Screen Sharing
  async toggleScreenSharing(): Promise<void> {
    if (!this.isScreenSharingSubject.value) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const sender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(screenStream.getVideoTracks()[0]);
        
        screenStream.getVideoTracks()[0].onended = () => {
          sender?.replaceTrack(this.localStream.getVideoTracks()[0]);
          this.isScreenSharingSubject.next(false);
        };

        this.isScreenSharingSubject.next(true);
      } catch (error) {
        console.error('❌ Error sharing screen:', error);
      }
    }
  }

  // ✅ Close Connection
  closeConnection(): void {
    this.peerConnection.close();
    this.localStream?.getTracks().forEach(track => track.stop());
    this.remoteStream?.getTracks().forEach(track => track.stop());
  }
}
