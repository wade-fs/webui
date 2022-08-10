[1]: ../assets/images/list-terminal-off.png
[2]: ../assets/images/list-terminal-off-disabled.png
[3]: ../assets/images/list-terminal-booting.png
[4]: ../assets/images/list-terminal-booting-disabled.png
[5]: ../assets/images/list-terminal-active.png
[6]: ../assets/images/list-terminal-active-restart.png
[7]: ../assets/images/list-terminal-active-disabled.png
[8]: ../assets/images/list-terminal-active-disabled-restart.png
[9]: ../assets/images/list-terminal-active-busy.png
[10]: ../assets/images/list-terminal-error.png
[11]: ../assets/images/list-terminal-error-restart.png
[12]: ../assets/images/list-terminal-error-disabled.png
[13]: ../assets/images/list-terminal-error-disabled-restart.png
[14]: ../assets/images/list-terminal-error-busy.png
[15]: ../assets/images/list-terminal-nolic.png
[16]: ../assets/images/list-terminal-nolic-restart.png
[17]: ../assets/images/list-terminal-nolic-disabled.png
[18]: ../assets/images/list-terminal-nolic-disabled-restart.png
[19]: ../assets/images/list-terminal-nolic-busy.png
[20]: ../assets/images/item-terminal-off.png
[21]: ../assets/images/item-terminal-off-disabled.png
[22]: ../assets/images/item-terminal-booting.png
[23]: ../assets/images/item-terminal-booting-disabled.png
[24]: ../assets/images/item-terminal-active.png
[25]: ../assets/images/item-terminal-active-restart.png
[26]: ../assets/images/item-terminal-active-disabled.png
[27]: ../assets/images/item-terminal-active-disabled-restart.png
[28]: ../assets/images/item-terminal-active-busy.png
[29]: ../assets/images/item-terminal-error.png
[30]: ../assets/images/item-terminal-error-restart.png
[31]: ../assets/images/item-terminal-error-disabled.png
[32]: ../assets/images/item-terminal-error-disabled-restart.png
[33]: ../assets/images/item-terminal-error-busy.png
[34]: ../assets/images/item-terminal-nolic.png
[35]: ../assets/images/item-terminal-nolic-restart.png
[36]: ../assets/images/item-terminal-nolic-disabled.png
[37]: ../assets/images/item-terminal-nolic-disabled-restart.png
[38]: ../assets/images/item-terminal-nolic-busy.png

- ![-off][1] ![][20]						-off
- ![-off-disabled][2]	![][21]				-off-disabled
- ![-booting][3] ![][22]					-booting
- ![-booting-disabled][4] ![][23]			-booting-disabled
- ![-active][5] ![][24]						-active
- ![-active-restart][6] ![][25]				-active-restart
- ![-active-disabled][7] ![][26]			-active-disabled
- ![-active-disabled-restart][8] ![][27]	-active-disabled-restart
- ![-active-busy][9] ![][28]				-active-busy
- ![-error][10] ![][29]						-error
- ![-error-restart][11] ![][30]				-error-restart
- ![-error-disabled][12] ![][31]				-error-disabled
- ![-error-disabled-restart][13] ![][32]		-error-disabled-restart
- ![-error-busy][14] ![][33]					-error-busy
- ![-nolic][15] ![][34]						-nolic
- ![-nolic-restart][16] ![][35]				-nolic-restart
- ![-nolic-disabled][17] ![][36]				-nolic-disabled
- ![-nolic-disabled-restart][18] ![][37]		-nolic-disabled-restart
- ![-nolic-busy][19] ![][38]					-nolic-busy

|ITEM						|Normal						|DISABLE						|ENABLE			|REBOOT/RESTART		|POWER-ON				|POWER-OFF		|
|:--------------------------|:--------------------------|:------------------------------|:--------------|:------------------|:----------------------|:--------------|
|O(F)F						|-off						|-off-disabled					|X				|X					|-booting				|X 				|
|							|							|								|				|					| -active-busy			| 				|
|							|							|								|				|					| -active				| 				|
|							|							|								|	 			|					| /-error				| 				|
|							|							|								|	 			|					| /-nolic				| 				|
|OF(F)+(D)ISABLED			|-off-disabled				|X								|-off			|X					|X						|X 				|
|(B)OOTING					|-booting					|-booting-disabled				|X				|X					|X						|X 				|
|(B)OOTING+(D)ISABLED		|-booting-disabled			|X								|-booting		|X					|X						|X 				|
|(A)CTIVE					|-active					|-active-disabled				|X				|-active-busy		|X						|-active-busy 	|
|							|							|								|				| -active			|						| -off 			|
|							|							|								|				| /-error			|						| 				|
|(A)CTIVE+(N)TR				|-active-restart			|-active-disabled-restart		|X				|同上				|X						|同上 			|
|(A)CTIVE+(D)ISABLED		|-active-disabled			|X								|-active		|-active-busy		|X						|-active-busy 	|
|							|							|								|				| -active-disabled	|						| -off-disabled |
|							|							|								|				| /-error-disabled	|						| 				|
|(A)CTIVE+(D)ISABLED+(N)TR	|-active-disabled-restart	|X								|-active-restart|同上				|X						|同上 			|
|(E)RROR					|-error						|-error-disabled				|X				|-error-busy		|X						|-error-busy 	|
|							|							|								|				| -active			|						| -off 			|
|							|							|								|				| /-error			|						| 				|
|(E)RROR+(N)TR				|-error-restart				|-error-disabled-restart		|X				|同上				|X						|同上 			|
|(E)RROR+(D)ISABLED			|-error-disabled			|X								|-error			|-error-busy		|X						|-error-busy 	|
|							|							|								|				| -active-disabled	|						| -off-disabled |
|							|							|								|				| /-error-disabled	|						| 				|
|(E)RROR+(D)ISABLED+(N)TR	|-error-disabled-restart	|X								|-error-restart	|同上				|X						|同上 			|
|NOL(I)C					|-nolic						|-nolic-disabled				|X				|-nolic-busy		|X						|-nolic-busy 	|
|							|							|								|				| -nolic			|						| -off 			|
|							|							|								|				| /-active			|						| 				|
|							|							|								|				| /-error			|						| 				|
|NOL(I)C+(N)TR				|-nolic-restart				|-nolic-disabled-restart		|X				|同上				|X						|同上 			|
|NOL(I)C+(D)ISABLED			|-nolic-disabled			|X								|-nolic			|-nolic-busy		|X						|-nolic-busy 	|
|							|							|								|				| -active-disabled	|						| -off-disabled |
|							|							|								|				| /-error-disabled	|						| 				|
|							|							|								|				| /-nolic-disabled	|						| 				|
|NOL(I)C+(D)ISABLED+(N)TR	|-nolic-disabled-restart	|X								|-nolic-restart	|同上				|X						|同上 			|
