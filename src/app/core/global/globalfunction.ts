import { environment } from '../../../../src/environments/environment';
import { DialogRef, DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import * as CryptoJS from 'crypto-js';

export class Globalfunction {
	public localstorageprefix = environment.LocalStoragePrefix;
	public encryptSecretKey = environment.ClientSecretKey;

	private encryptSecretSalt = CryptoJS.enc.Utf8.parse(environment.ClientSecretSalt);

	private encryptSecretKeyClient = environment.ClientSecretKey;
	private encryptSecretSaltClient = environment.ClientSecretSalt;

	public path_prefix = window.location.pathname.replace('/', '');
	public prefix = this.path_prefix.toLowerCase() ;

	constructor( private dialogService: DialogService = null ) {
	}

	public setlocalstorage(name: string, value: string)
	{
		localStorage.setItem(this.localstorageprefix + name, this.encryptData(value));
	}

	public removelocalstorage(name: string)
	{
		localStorage.removeItem(this.localstorageprefix + name);
	}

	public getlocalstorage(name: string)
	{
		if(localStorage.getItem(this.localstorageprefix + name) != null)
				{return this.decryptData(localStorage.getItem(this.localstorageprefix + name));}
		else
				{return localStorage.getItem(this.localstorageprefix + name);}
	}

	// encryptData(data) {
	//     try {
	//       return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
	//     } catch (e) {
	//       console.log(e);
	//     }
	// }

	// decryptData(data) {
	//     try {
	//       const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
	//       if (bytes.toString()) {
	//         return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	//       }
	//       return data;
	//     } catch (e) {
	//       console.log(e);
	//     }
	// }

	encryptData(data) {
		try {
			const EncKey = CryptoJS.PBKDF2(this.encryptSecretKey, this.encryptSecretSalt, {
				keySize: 8,   //8 words = 32 byte = 256 bit
				iterations: 1000,
				hasher: CryptoJS.algo.SHA256
			});
			const EncIV = CryptoJS.lib.WordArray.random(128 / 8);  //16 bytes

			const EncResult = CryptoJS.AES.encrypt(data, EncKey, {iv:EncIV, mode:CryptoJS.mode.CBC});


			const CombineResultHex = CryptoJS.enc.Hex.stringify(EncIV) + CryptoJS.enc.Hex.stringify(EncResult.ciphertext);
			const CombineResult = CryptoJS.enc.Hex.parse(CombineResultHex);
			return (CryptoJS.enc.Base64.stringify(CombineResult));
		} catch (e) {
			console.log(e);
		}
	}

	decryptData(data) {
		try {
			const EncKey = CryptoJS.PBKDF2(this.encryptSecretKey, this.encryptSecretSalt, {
				keySize: 8,   //8 words = 32 byte = 256 bit
				iterations: 1000,
				hasher: CryptoJS.algo.SHA256
			});

			const ivCipherObj = CryptoJS.enc.Base64.parse(data);
			const ivCipher = CryptoJS.enc.Hex.stringify(ivCipherObj);
			const EncIV = CryptoJS.enc.Hex.parse(ivCipher.substring(0, 32));  //16 bytes for IV.
			const cipherText = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(ivCipher.substring(32, ivCipher.length)));
			const bytes = CryptoJS.AES.decrypt(cipherText, EncKey, {iv:EncIV, mode:CryptoJS.mode.CBC});
			if (bytes.toString()) {
				return bytes.toString(CryptoJS.enc.Utf8);
			}
			return '';
		} catch (e) {
			console.log(e);
		}
	}

	public messageDialogBox(message: string, title: string) {
		const dialog: DialogRef = this.dialogService.open({
			title,
			content: message,
			actions: [
					{ text: 'Ok', primary: true }
			],
			width: 400
		});

		dialog.result.subscribe((result) => {
				if (result instanceof DialogCloseResult) {
						console.log('close');
				} else {
				}
		});
	}

	public ResizeImage(src, newX, newY) {
		return new Promise((res, rej) => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				const elem = document.createElement('canvas');
				elem.width = newX;
				elem.height = newY;
				const ctx = elem.getContext('2d');
				ctx.drawImage(img, 0, 0, newX, newY);
				const data = ctx.canvas.toDataURL();
				res(data);
			};
			img.onerror = error => rej(error);
		});
	}

	encryptDataClient(data) {
		try {
			const EncKey = CryptoJS.PBKDF2(this.prefix + this.encryptSecretKeyClient, this.encryptSecretSaltClient, {
				keySize: 8,   //8 words = 32 byte = 256 bit
				iterations: 1000,
				hasher: CryptoJS.algo.SHA256
			});
			const EncIV = CryptoJS.lib.WordArray.random(128 / 8);  //16 bytes

			const EncResult = CryptoJS.AES.encrypt(data, EncKey, {iv:EncIV, mode:CryptoJS.mode.CBC});


			const CombineResultHex = CryptoJS.enc.Hex.stringify(EncIV) + CryptoJS.enc.Hex.stringify(EncResult.ciphertext);
			const CombineResult = CryptoJS.enc.Hex.parse(CombineResultHex);
			return (CryptoJS.enc.Base64.stringify(CombineResult));
		} catch (e) {
			console.log(e);
		}
	}

	decryptDataClient(data) {
		try {
			const EncKey = CryptoJS.PBKDF2(this.prefix + this.encryptSecretKeyClient, this.encryptSecretSaltClient, {
				keySize: 8,   //8 words = 32 byte = 256 bit
				iterations: 1000,
				hasher: CryptoJS.algo.SHA256
			});

			const ivCipherObj = CryptoJS.enc.Base64.parse(data);
			const ivCipher = CryptoJS.enc.Hex.stringify(ivCipherObj);
			const EncIV = CryptoJS.enc.Hex.parse(ivCipher.substring(0, 32));  //16 bytes for IV.
			const cipherText = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(ivCipher.substring(32, ivCipher.length)));
			const bytes = CryptoJS.AES.decrypt(cipherText, EncKey, {iv:EncIV, mode:CryptoJS.mode.CBC});
			if (bytes.toString()) {
				return bytes.toString(CryptoJS.enc.Utf8);
			}
			return '';
		} catch (e) {
			console.log(e);
		}
	}

	public static DateTimeToDate(OrgDateTime: Date) { //this function remove time parts in current time
		return new Date(OrgDateTime.toDateString());
	  }

	public static DateTimeToDateOnlyUTC(OrgDateTime: Date) {  //this function remove time parts and set timezone to utc, useful when date value send to server, time will still zero although it auto convert to utc.
		const DateOnly = new Date(OrgDateTime.toDateString());
		const UTCDateOnly = new Date(DateOnly.getTime() - (DateOnly.getTimezoneOffset() * 60000));  // localtimemilisecond - (utcoffsetminute * 60 * 1000)
		return UTCDateOnly;
	  }
}
