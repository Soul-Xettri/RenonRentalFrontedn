import { Injectable, Output, EventEmitter } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    private hubConnection: signalR.HubConnection;
    recievedSuccessCount = new BehaviorSubject({});
    onMessageRecieved = this.recievedSuccessCount.asObservable();


    _createNotification$ = new BehaviorSubject(null);
    onCreateNotification$ = this._createNotification$.asObservable();
    _updateCustomization$ = new BehaviorSubject(null);
    onUpdateCustomization$ = this._updateCustomization$.asObservable();

    onlineUserReceived = new EventEmitter<any>();
    onUserActiveEvent = new EventEmitter<any>();
    onUserInActiveEvent = new EventEmitter<any>();

    connectionEstablished = new EventEmitter<boolean>();
    private connectionIsEstablished = false;
    signalId: any;
    loginToken: any;

    constructor() {
        this.loginToken = typeof window !== 'undefined' && localStorage ? localStorage.getItem('authToken') : null;

        this.startConnection();
    }

    public startConnection(): void {

        const options = {
            accessTokenFactory: () => this.loginToken,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        };
 
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.BASE_SIGNAL}message`, options)
            .withAutomaticReconnect()
            .build();

        // const options = {
        //     accessTokenFactory: () => this.loginToken,
        //     transport: signalR.HttpTransportType.WebSockets
        // };
        // //const debugSignalRValueFromlocalStorage = localStorage.getItem('signalR_debug');
        // // const logLevel = environment
        // //     ? debugSignalRValueFromlocalStorage !== null
        // //         ? debugSignalRValueFromlocalStorage
        // //         : signalR.LogLevel.None
        // //     : signalR.LogLevel.None;
        // this.hubConnection = new signalR.HubConnectionBuilder()
        //     .withUrl(`${environment.BASE_SIGNAL}message`, options)
        //     .withAutomaticReconnect()
        //     .build();

        this.hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                this.hubConnection.invoke('GetOnlineUsers').catch((err) => {});
                this.connectionEstablished.emit(true);
            })
            .catch((err) => {
                console.log(err);
                console.log('Error while establishing connection, retrying...');
            });

        this.hubConnection.onclose(async () => {
            await this.startConnection();
        });



        // this.hubConnection.on('')

        this.hubConnection.on('onConnectedAsync', (connectionId) => {
            if (connectionId) {
                setTimeout(() => {
                    this.signalId = connectionId;
                    console.log(this.signalId);
                });
            }
        });
    }

   
    OnlineUsers() {
        this.hubConnection.invoke('GetOnlineUsers').catch((err) => {});
    }
    public getOnlineUsers(): void {
        this.hubConnection.on('OnlineUsers', (data: any) => {
            this.onlineUserReceived.emit(data);
        });
        this.hubConnection.on('onUserActive', (data: any) => {
            this.onUserActiveEvent.emit(data);
        });
        this.hubConnection.on('onUserInActive', (data: any) => {
            this.onUserInActiveEvent.emit(data);
        });
    }

    public onNotificationCreateSignal() {
        this.hubConnection.on('NotificationSend', (resp) => {
            console.log('Send Notification');
            this._createNotification$.next(resp);
        });
    }

    public onLoginSignal() {
        this.hubConnection.on('OnLoginSignal', (resp) => {
            console.log('Send Notification');
            this._createNotification$.next(resp);
        });
    }

  
}
