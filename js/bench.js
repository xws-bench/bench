const ROCKIMG="png/asteroid3.jpeg";
const DEBRISIMG="png/debris.png";
var OBSTACLES=[];
var PX=[300,500,300,500,300,500];
var PY=[250,250,400,400,550,550];
var id=0;
const MAXROCKS=20;
const ROCKS=[
"m 104,7.69 c 23.68645,6.788715 36.31832,32.149873 60.26972,38.343289 22.5828,-0.437523 44.66378,16.533927 47.0145,39.571574 1.7824,16.350067 17.58775,28.375637 19.42957,45.557037 4.62232,16.14295 -3.063,34.92477 -18.79084,41.60093 -19.22063,12.27219 -23.97348,36.29633 -26.3595,57.32031 -11.7719,24.5963 -39.77913,35.95058 -65.41883,39.06789 -22.440402,-6.18345 -41.283826,10.88352 -61.241176,17.63584 -16.76045,5.45152 -33.113233,-7.47894 -38.530882,-22.80759 C 17.176622,247.87625 8.1464261,234.3236 4.0567839,218.40819 -1.7438181,195.92883 0.63774097,172.45364 4.606828,149.91669 6.1331829,124.03728 -5.926177,97.8685 3.3319943,72.406886 13.558278,40.415571 42.544211,19.463551 70.611984,3.7855478 81.374827,-1.0770344 94.740584,0.18536967 104,7.69 Z",
"m 74,7.61 c 7.753759,10.858255 23.659647,10.35574 34.20385,4.142701 9.03128,-4.0534436 19.21494,-1.9401962 28.52161,-5.0910648 10.92015,-2.154159 21.76622,-6.83507944 32.99101,-6.11838415 11.23296,2.00017155 13.66436,15.68926995 8.03436,24.21865495 -4.25358,10.809597 -16.56604,13.981888 -22.0997,23.735597 -7.53509,10.764739 -16.34633,24.503225 -31.127,24.468428 C 106.27572,72.548533 92.950913,91.727866 74.194294,88.144844 53.667818,82.293086 47.847944,55.910483 26.797923,50.69776 17.185894,50.719378 7.3060035,46.218346 3.1175923,37.113415 -2.8694247,26.930094 1.5394187,12.37286 13.030969,8.3968377 31.259956,1.4461437 53.349301,-4.6053888 71.463354,5.9051033 L 72.744026,6.7252875 74,7.61 Z",
"m 138.53,10.01 c 5.40626,19.802152 28.87853,18.911256 43.83272,26.459905 11.82989,11.386765 31.17305,17.630966 36.42803,33.950779 2.76543,19.624152 -17.99639,27.262955 -31.52942,35.447526 -20.56062,12.50938 -15.67798,41.22927 -31.85977,56.80308 -24.38514,18.96463 -57.192913,8.68832 -83.266997,-0.73605 C 52.576398,152.8614 28.041486,160.65945 11.190678,145.71557 -10.095375,129.9042 5.6556381,104.78632 23.486247,94.500663 41.288608,78.919071 45.241114,53.068768 63.439939,37.518779 81.853911,28.422426 88.100324,1.9971094 110.1991,-0.04794856 120.29646,0.14465668 131.88206,1.3566358 138.53,10.01 Z",
"m 72,0.6 c 14.992071,11.950867 27.356734,30.835777 49.0539,29.052927 22.54799,4.831198 11.23093,26.179505 10.66804,40.712681 1.29041,14.474071 22.7749,29.284722 9.00205,42.809722 -13.17549,7.38011 -25.84477,-13.04589 -39.91957,-2.56419 -15.021143,8.78534 -32.001234,23.92033 -50.515361,15.66927 C 35.997216,113.15938 16.127851,106.79857 2.1855691,94.383884 -1.9388697,76.898501 4.7466217,58.441952 0.18438048,40.73882 5.806309,19.339462 29.633649,12.251672 47.490222,3.9936009 55.293323,1.1777068 63.69706,-0.47426763 72,0.6 Z",
"m 92,3.55 c 13.35095,8.210786 30.00977,12.329972 45.29538,7.505902 14.45246,-1.6753573 32.50637,7.379137 33.3896,23.277674 -1.16698,9.619667 0.66069,19.077557 3.44222,28.233278 2.93882,9.916384 -2.53869,19.612559 -10.66892,25.090369 -8.67744,6.76962 -19.58996,11.562362 -25.09186,21.625407 C 122.19669,126.15279 96.416289,137.714 73.363004,129.22379 55.525476,120.88068 36.083637,114.55994 21.716964,100.47179 9.4202131,92.882312 -3.2620408,80.742356 -0.20756142,64.830795 2.5853742,21.920143 51.014336,-12.142371 92,3.55 Z",
"m 88,2.74 c 14.89109,15.864469 2.110781,42.020731 18.2397,57.227029 14.57912,9.438869 32.69928,18.10007 37.81781,36.219188 2.33267,12.551883 -4.98332,24.138463 -6.42804,36.406793 -5.71592,28.56302 -10.66403,58.58523 -28.18426,82.73461 C 98.325691,232.46357 84.01503,250.5467 63.256996,255.54156 49.213713,255.38464 40.958093,241.00245 40.126977,228.3937 37.959362,214.06608 35.463141,199.2234 26.80698,187.16906 15.184733,168.07566 -0.3727357,148.86285 0.4410242,125.2403 -0.82700464,113.95211 0.519549,101.14315 10.224845,93.729596 20.701913,83.99428 34.545443,79.406559 46.583369,72.066911 53.792512,51.74081 50.415478,26.382572 67.670781,10.611651 73.195023,5.947624 80.084933,-1.5559468 88,2.74 Z",
"m 70,4.85 c 42.89941,11.006942 88.6401,43.28005 90.08216,91.521071 4.22874,32.066519 -25.2289,52.095309 -32.77045,79.371239 3.64366,27.24689 -21.21346,30.54811 -41.778085,30.6541 -21.372431,4.1684 -46.503427,26.35806 -65.567673,4.77976 C 3.3962995,181.86073 43.409531,166.1283 54.968858,144.61803 66.594281,121.17951 24.886107,110.63839 36.541486,85.749591 36.788718,57.106427 1.9022922,43.643872 0.13121547,16.51475 11.628065,-9.165748 48.972608,0.09541228 70,4.85 Z",
"m 96,7.07 c 22.21936,-1.2748503 43.42137,10.625131 53.9089,30.272432 8.69197,19.332889 29.14037,36.901754 25.83445,59.413289 -7.95029,18.940209 -35.1644,24.545899 -28.70496,50.351999 -1.28406,21.10408 -27.33498,25.04775 -44.12503,26.41517 C 70.449544,167.8654 53.977736,135.08707 36.549008,110.65576 24.184423,92.2867 -4.119229,80.15006 -0.04494536,54.336438 2.2215288,30.459903 28.930966,27.401092 43.204026,13.183848 57.854593,-1.7401486 77.888088,-2.5989637 96,7.07 Z",
"m 22.83,10.14 c 36.381764,-7.5182231 75.332367,38.705706 106.91598,1.085856 31.19487,-26.154371 64.93771,4.569675 55.83452,40.417752 1.71024,59.468512 22.98507,123.885752 -7.35227,179.631272 -25.41621,20.31663 -58.99436,-0.0606 -86.820718,-3.84368 C 51.742324,218.90308 20.026502,183.63753 28.77643,141.9493 30.362924,107.69434 -3.8628827,84.245955 1.6335787,49.436507 3.2882936,34.68249 8.8431709,17.52641 22.83,10.14 Z",
"m 73.35,7.1 c 0.742924,12.833017 9.807449,30.172841 25.048008,26.528143 12.599832,-3.585974 26.310422,0.221493 34.295202,10.888176 7.73658,9.139649 12.54536,20.89596 23.4449,27.005137 11.57532,7.821056 24.58954,16.721939 27.19873,31.558114 5.2342,14.71903 7.51038,37.09103 -9.77698,44.67607 -13.80015,7.13307 -29.14257,-1.25293 -43.31614,3.72193 -15.15132,5.75741 -29.03507,-4.44612 -42.634543,-9.54349 -12.876028,-7.03738 -23.708035,3.30735 -33.940389,9.99189 -10.952691,7.628 -28.068654,3.85643 -32.543364,-9.34957 C 17.241811,131.38836 19.162764,117.59989 9.6636371,108.86755 0.15964236,94.112038 1.7097107,75.919244 1.8103437,59.24479 -0.3116275,44.692966 -3.0568617,24.567133 12.428846,16.257076 26.141799,8.6801814 39.824977,-3.1474859 56.644493,-0.08206564 62.578526,1.0293171 69.0122,2.5858262 73.35,7.1 Z",
"m 102,0.21 c 23.61326,-4.7742217 51.16121,11.73593 53.54307,36.69987 21.13119,18.005513 53.25206,4.662235 74.55944,23.311004 22.65735,16.804037 21.00815,47.485046 21.62736,72.671856 0.43306,30.01726 26.25312,58.22 12.89012,88.29914 -18.75656,25.83353 -53.60122,25.96862 -81.62681,34.04374 C 135.5408,265.27781 81.577228,270.66209 38.232192,244.33067 6.9293937,226.26954 -10.189513,184.12625 6.784637,150.71849 17.122164,118.96541 34.809642,84.588051 21.694586,50.963708 14.927939,28.153412 35.951375,8.3332141 57.118388,5.0589238 71.860142,2.3204637 86.957794,-0.28888751 102,0.21 Z",
"m 89.32,24.66 c 7.9625,5.588282 18.11069,11.432752 19.47608,22.040464 0.0713,11.380458 -5.26314,22.564982 -12.989602,30.768455 -7.782536,8.131695 -21.20007,14.120957 -31.758821,7.709676 C 57.730916,81.320978 51.834067,76.247376 44.226347,75.243966 32.970122,71.801274 22.789116,63.602609 18.590866,52.405008 13.675682,45.204443 1.8028657,40.50528 4.1280348,30.087205 6.0641439,21.282435 15.670301,17.787489 23.781595,18.047675 32.363214,18.899333 39.762362,14.27495 47.323866,11.057853 54.036138,10.011348 60.080345,6.7869695 66.94239,6.5239514 73.827745,6.2832858 79.992573,10.600531 83.027632,16.625433 84.923397,19.450903 86.872053,22.276379 89.32,24.66 Z"
];

const DEBRISCLOUD=[
"M 304.95954,64.376304 C 277.49277,82.276003 241.66827,69.454477 211.41731,79.85341 182.94785,87.482512 151.97474,94.154867 123.11879,83.943747 95.48938,75.99336 66.651738,70.398968 37.484081,73.398842 18.970572,78.061107 -14.137683,61.027612 8.1795392,44.831273 35.781402,29.89724 66.869667,20.316467 97.592631,11.657888 162.57714,-6.6090419 236.65056,-0.9763699 294.31725,32.566319 c 15.15677,5.196271 26.61381,20.160102 10.64229,31.809985 z",
"m 342.60305,45.386961 c -7.29191,22.348261 -9.66643,46.973239 -30.70022,65.744569 -9.56291,8.46772 -25.11789,12.92218 -40.59786,11.98244 C 220.12739,123.1282 171.21545,103.90824 119.65346,111.45169 79.932518,115.72011 39.481042,104.62899 9.8413502,86.727358 -3.629765,72.850491 5.3001906,54.56609 20.913419,43.453167 39.272225,29.821382 66.622062,19.233063 94.387958,22.827131 144.87655,25.920022 198.72655,22.705697 242.49463,3.6247875 c 38.9784,-6.1384604 84.97751,7.9784805 98.78833,34.5910935 0.92712,2.352947 1.12743,4.748359 1.32009,7.17108 z M 98.348381,22.576575 l 0.55403,-0.173574 -0.55403,0.173574 z m 24.424669,1.147571 0.55403,-0.173574 -0.55403,0.173574 z m 28.00812,0.08717 0.55403,-0.173574 -0.55403,0.173574 z m 22.30992,-1.125739 0.55404,-0.173574 -0.55404,0.173574 z m 2.17138,-0.213036 0.55402,-0.173574 -0.55402,0.173574 z m 0.62445,-0.238469 0.55403,-0.173575 -0.55403,0.173575 z m 1.54695,0.02544 0.55403,-0.173574 -0.55403,0.173574 z m 14.92991,-3.236843 0.55404,-0.173569 -0.55404,0.173569 z m 6.37929,-1.511898 0.55401,-0.173565 -0.55401,0.173565 z M 237.86298,5.344172 238.417,5.1706024 237.86298,5.344172 Z",
"M 8.6920869,121.16887 C -4.1927589,98.966912 0.90898033,72.55157 8.7041909,49.662049 14.372638,35.476035 16.326584,18.502785 30.338869,8.681508 45.825701,-3.4131758 72.656091,-5.7614358 86.844372,9.2566296 97.590533,22.345836 117.873,25.584085 134.01661,19.956304 c 11.08514,-3.247312 20.45186,-9.79416 30.54262,-14.8525666 14.11297,-5.1505053 26.8782,7.2472106 29.23156,19.2600866 4.21484,11.498886 -1.06379,24.192355 6.41451,34.874819 7.62632,15.290163 20.05159,31.543452 14.34819,49.165577 -3.03505,13.5232 -12.4538,26.30757 -27.13751,30.91577 -13.91592,5.06137 -29.79779,3.4131 -43.10475,-2.40379 -17.36813,-4.34952 -33.14526,6.4165 -46.726747,14.86036 -14.840207,9.32885 -35.077152,16.24822 -52.087702,7.44298 -16.955592,-7.9194 -28.150179,-23.00607 -36.8043201,-38.05067 z",
"m 91.923226,127.78997 c 5.513731,11.3981 10.972854,25.51358 4.351499,37.62239 -7.54852,11.28418 -25.767729,9.59278 -33.334473,-0.81802 C 55.622193,157.05053 54.513378,146.07813 49.726705,137.18449 41.653771,125.15429 24.823594,120.63855 20.32487,105.94528 19.390228,97.039845 28.352819,92.306256 34.653598,88.093208 45.592211,81.790657 47.006891,67.243399 43.146197,56.335555 40.153404,45.98415 32.61561,38.046886 25.958609,29.920187 21.014609,18.807726 32.47462,6.8789866 43.555566,7.023595 52.328844,7.0126986 62.046398,10.741411 69.897324,4.9841051 78.99616,-0.10794813 86.373887,-10.091033 97.644393,-9.976946 c 13.469977,1.6211714 21.001927,14.9780158 24.779587,26.68591 4.09484,12.671839 4.09866,26.180141 7.02758,39.110388 1.46634,10.045348 -1.9205,22.178303 -12.13367,26.284736 -14.87769,7.426397 -27.334214,22.427262 -27.509921,39.622562 0.182575,2.25508 -0.171998,4.82307 2.115257,6.06332 z m -4.240826,-5.7236 c -2.796123,0.46537 0.642581,1.50828 0.72337,0.29222 l -0.72337,-0.29222 z",
"m 53.39,17 c 8.857468,18.680274 35.638969,29.655166 53.26768,16.552682 9.4851,-13.02633 29.26144,-21.688691 42.23907,-8.10085 13.3583,12.578881 11.1836,35.187026 -1.51894,47.443912 -9.14919,9.666576 -13.28816,23.915425 -6.58545,36.100486 5.44133,14.24364 14.35173,28.50153 11.97365,44.38173 5.07893,15.66617 -15.68191,32.3177 -29.44475,22.33028 C 110.6022,169.06652 93.829496,166.42587 87.217235,151.92188 78.379044,137.89166 83.963593,119.73027 74.402737,106.12243 65.827752,92.01835 48.203264,82.689295 31.783423,87.523944 18.33036,88.28596 11.389874,73.121866 13.520578,61.502437 15.481591,47.172531 -2.1632982,36.550726 4.0544615,21.982665 9.0812944,2.1611127 40.629477,-6.3421749 51.54838,12.953159 52.291692,14.237963 52.912978,15.594107 53.39,17 Z",
"m 53,28.01 c 17.264267,-0.215909 32.661816,-13.369626 50.21866,-9.082602 7.22749,2.514502 14.01831,10.390153 22.24021,5.672311 11.30763,-5.596745 17.32705,-20.2041726 30.88327,-21.3792418 11.63112,0.9015139 18.09339,12.3581728 24.16953,20.9111348 8.18578,10.112096 3.95736,25.007478 -5.15698,32.980017 -6.99113,8.003235 -17.51071,9.445625 -26.92735,12.360189 -14.16502,8.412284 -13.3072,30.629892 -29.93155,36.224342 -14.8311,-2.26076 -20.970578,-21.014783 -36.475878,-21.444488 -17.53188,0.713857 -29.193332,17.645528 -32.013793,33.593988 -1.961796,8.81551 0.354193,19.03046 -6.246545,26.36422 -5.430599,7.83687 -17.165422,10.68299 -24.881498,4.42654 C 4.9530851,138.95257 4.5896229,118.11427 12.893511,104.63532 19.137393,89.506979 26.037539,72.290072 19.933499,55.997969 17.518418,48.114476 9.4615578,44.674169 5.3905151,37.988065 -0.63100116,29.32318 -1.2186853,14.692506 9.3842495,9.2505971 18.552531,3.804272 28.646946,10.231493 35.097662,16.846668 40.328121,21.512442 45.748065,26.928689 53,28.01 Z",
"m 168.96,92 c -18.50703,19.38046 -3.01703,54.1903 23.95617,52.99453 19.19731,4.43402 27.75181,29.62521 13.24594,43.78213 -13.678,13.91986 -28.60684,33.36373 -50.94777,25.56722 C 132.89847,209.53592 117.2191,188.40609 92.738599,190.39623 73.511926,192.25447 46.474831,188.69238 45.221174,164.12611 47.858658,139.29003 19.45257,136.80785 5.4202307,126.69731 -4.7122326,101.49779 26.120786,90.455869 44.41309,85.144865 71.708322,72.249234 58.921776,45.204494 56.456307,23.773578 65.305726,5.2763567 90.435503,10.848472 106.49066,2.9345145 133.66834,-7.4060996 133.72447,31.035544 147.59229,43.624972 161.10873,55.504323 178.34631,72.281842 168.96,92 Z",
"m 183.99,21 c -5.56101,14.774238 -10.2477,33.563429 0.63641,47.120851 9.17136,8.95922 24.20153,3.674604 33.84782,12.312651 17.7844,11.961888 26.62799,33.887568 27.46098,54.728648 -0.88728,13.54567 -15.82829,20.54396 -28.00934,18.62906 -12.52223,-0.58085 -23.82537,-6.85871 -33.46056,-14.40887 -23.36253,-12.84254 -51.25219,-5.20342 -74.25967,4.51817 -14.904768,6.77899 -30.771017,14.6877 -47.650424,11.46214 C 50.281769,153.28514 41.539746,142.6497 29.150367,140.78095 18.214439,137.6825 4.4568112,135.09631 -0.33046599,123.26948 -2.0525657,107.0685 14.467061,96.197332 28.643924,93.886155 c 19.97782,-4.24195 40.661561,2.422228 60.514619,-2.233597 20.492967,-8.00363 29.015007,-30.475583 35.045477,-49.885401 2.45271,-13.03661 8.61197,-25.547868 19.48849,-33.5363126 9.51432,-8.26542468 25.89966,-12.0039348 35.33904,-1.6198311 C 182.64496,10.400522 184.68305,15.755864 183.99,21 Z",
"m 167,10.03 c 8.61332,11.733364 24.83887,11.186348 37.52164,7.864768 11.43633,-2.298219 24.04442,-5.736899 35.00002,0.08332 12.67268,14.243207 4.59387,35.94259 -7.70045,47.589028 -7.26252,9.015314 -19.05552,9.440288 -28.61213,14.415579 -15.38504,7.593175 -28.19142,23.270189 -46.67795,22.424269 -12.57735,-0.37299 -21.05597,-12.961046 -33.9889,-11.75122 -19.17926,-0.06631 -35.334555,22.20865 -26.387033,40.00049 4.126283,9.2659 17.003503,15.67229 13.998643,27.27996 -6.45663,11.01615 -21.675732,10.64774 -32.92803,11.22868 -10.935349,-0.9392 -16.018548,16.25838 -29.314738,13.65383 -21.53893,0.66305 -36.824707,-22.96858 -31.944453,-42.86518 2.364129,-13.52708 12.077562,-28.58683 3.573383,-41.761378 C 12.106522,91.199521 3.1288265,85.121422 1.7167286,73.903193 -4.6401612,48.365802 12.28966,16.672837 39.900312,13.991916 49.325716,12.840211 57.436875,19.235805 66.624607,20.478449 87.461898,25.968426 111.74653,22.670227 127.35394,6.7895446 138.74069,-3.5031337 156.70439,-0.14037568 167,10.03 Z",
"M 45.017141,207.88249 C 40.489055,195.9527 25.827599,206.13858 21.94712,198.49629 19.632225,187.57903 12.847701,179.62497 6.1210952,172.45416 -2.1013702,162.80832 0.58802524,147.44145 5.4357312,136.54149 10.206078,124.65819 7.3245454,111.15212 7.3158644,98.512143 6.4050751,86.653353 5.8944066,74.363257 2.9866746,63.025517 -3.0945957,50.158376 4.6572881,34.454161 14.459331,28.196862 23.163632,22.64584 33.648155,21.461042 41.110104,13.073868 47.272935,5.5331831 57.13929,-4.6636044 64.819173,6.2087031 c 8.451474,6.9186479 19.730211,8.0459719 26.251344,18.4169699 5.623554,7.368098 10.589753,16.766842 19.405613,18.641368 8.45283,2.011794 11.72519,12.513564 17.96635,18.41878 4.74183,5.325133 10.27373,9.616207 15.91481,13.264365 1.40106,5.623733 0.31403,11.884034 0.65112,17.787681 0,16.944073 0,33.888153 0,50.832233 -10.60566,6.85851 -22.89864,11.25864 -30.94326,22.71309 -3.05232,11.23343 -8.47523,22.82921 -19.248128,23.52228 -13.193897,6.68059 -23.291218,20.29593 -36.864647,25.89708 -5.13592,0.53934 -9.196334,-4.2949 -12.935234,-7.82006 z"
];

function loadrock(s,str) {
    var i,j;
    var coord=[],o,ob;
    id=0;
    if (typeof TEAMS[1].rocks=="undefined"||TEAMS[1].rocks[2]==-1) TEAMS[1].rocks=[0,1,2];
    if (typeof TEAMS[2].rocks=="undefined"||TEAMS[2].rocks[2]==-1) TEAMS[2].rocks=[3,4,5];
    if (str !="") {
	o=str.split(";");
	for (i=0; i<6; i++) {
	    ob=o[i].split(",");
	    coord[i]=[parseInt(ob[0],10),parseInt(ob[1],10),parseInt(ob[2],10)];
	    if (ob.length==4) {
		if (i<3) TEAMS[1].rocks[i]=parseInt(ob[3],10);
		else TEAMS[2].rocks[i-3]=parseInt(ob[3],10);
	    }
	}
    } else for (i=0; i<6; i++) {
	do {
	    var ok=true;
	    coord[i]=[Math.random()*400+200,Math.random()*400+200,Math.random()*45];
	    for (j=0; j<i; j++) {
		var dx=coord[i][0]-coord[j][0]+PX[i]-PX[j];
		var dy=coord[i][0]-coord[j][0]+PY[i]-PY[j];
		if (dx*dx+dy*dy<15000) { ok=false;break; }
	    } 
	} while (!ok);
    }
    for (i=0; i<3; i++) {
	OBSTACLES[i]=new Rock(TEAMS[1].rocks[i],coord[i],1,i);
	OBSTACLES[i+3]=new Rock(TEAMS[2].rocks[i],coord[i+3],2,i);
    }
}
function saverock() {
    if (OBSTACLES.length==0) return "";
    var str=OBSTACLES[0].toASCII();
    for (var i=1; i<6; i++) 
	str+=";"+OBSTACLES[i].toASCII();
    return str;
}

class Rock {
    constructor(frag,coord,team,n) {    
	var k;
	var i=(team-1)*3+n;
	this.o=[];
	this.type=(frag>=MAXROCKS)?DEBRIS:ROCK;
	this.id=frag;
	this.name=(frag>=MAXROCKS?"Debris #":"Asteroid #")+i;
	this.arraypts=[];
	this.dragged=false;
	this.tx=coord[0];
	this.ty=coord[1];
	this.team=team;
	this.alpha=coord[2];
	PATTERN = s.image(((frag>=MAXROCKS)?DEBRISIMG:ROCKIMG),0,0,256,256).pattern(0,0,256,256);
	var ASTER=(frag>=MAXROCKS?DEBRISCLOUD:ROCKS);
	this.inside=s.path(ASTER[frag%MAXROCKS]).attr({
	    fill: PATTERN,
	    strokeWidth: 0,
	    stroke: "#888",
	    "class":"ASTEROID"+team,
	});
	//var shadow = s.filter(Snap.filter.shadow(0, 10,15,"#000", 1));
	this.outline=s.path(ASTER[frag%MAXROCKS]).attr({
	    fill:"rgba(0,0,0,0)",
	    //filter:shadow,
	    strokeWidth:2,
	    stroke:"#888"
	});
	this.g=s.group(this.inside,this.outline);
	for (k=0; k<this.outline.getTotalLength(); k+=5) 
	    this.arraypts.push(this.outline.getPointAtLength(k));
	if (REPLAY.length==0) this.addDrag();

	this.path="";
	this.outlinepts=[];
	this.g.hover(function() { this.outline.attr({strokeWidth:6,stroke:"#F00"});}.bind(this),
		     function()  {this.outline.attr({strokeWidth:2,stroke:"#888"});}.bind(this));
	this.g.addClass("unit");
	var b=this.g.getBBox();
	this.o=[];
	var scale=0.27;
	if (frag>=MAXROCKS) scale=0.4;
	frag=frag%MAXROCKS;
	for (k=1; k<4; k++) {
	    this.o[k]=s.ellipse(b.x+b.width/2,b.y+b.height/2,200/scale/2*k+b.width/2,200/scale/2*k+b.height/2).attr({pointerEvents:"none",display:"none",fill:WHITE,opacity:0.3,strokeWidth:2});
	}

	this.m=(new Snap.Matrix()).translate(coord[0],coord[1]).rotate(coord[2],0,0).scale(scale,scale);
	//this.g.transform('t '+(-b.width/2-b.x)+" "+(-b.height/2-b.y));
	this.getOutlineString();

	//console.log("ROCK called "+i+" "+coord[0]+" "+PX[i]+" "+frag);
	this.g.transform(this.m);
	this.g.appendTo(VIEWPORT);

	this.show();
    };

    addDrag() {
	this.g.drag(this.dragmove.bind(this), 
		    this.dragstart.bind(this),
		    this.dragstop.bind(this));
    };
    unDrag() {
	this.g.undrag();
    };
    getBall() {
	var b=this.g.getBBox();
	return {x:b.x+b.width/2,y:b.y+b.height/2,diam:Math.max(b.width/2,b.height/2)};
    };
    toASCII() {
	return Math.floor(this.tx)+","+Math.floor(this.ty)+","+Math.floor(this.alpha)+","+this.id;
    };
    getrangeallunits() { return Unit.prototype.getrangeallunits.call(this);};
    getrange(sh) { return Unit.prototype.getrange.call(this,sh); };
    gethitrangeallunits() {return [[],[],[],[]];};
    togglehitsector() {};
    togglerange() { };
    getOutlinePoints() {
	var k;
	this.outlinepts=[];
	for (k=0; k<this.arraypts.length; k+=5) {
	    var p={x:this.arraypts[k].x,y:this.arraypts[k].y};
	    this.outlinepts.push(transformPoint(this.m,p));
	}
	return this.outlinepts;
    };
    getBox() { };
    getOutline() {
	var out= s.path(this.path); 
	out.appendTo(s);
	return out;
    };
    getOutlineString() {
	var k;
	var pts=[];
	this.getOutlinePoints();
	this.path="M ";
	for (k=0; k<this.outlinepts.length; k++) {
	    var p=this.outlinepts[k];
	    this.path+=p.x+" "+p.y+" ";
	    if (k==0) this.path+="L ";
	}
	this.path+="Z";
	// For debugging obstacle positioning/collision
	//s.path(this.path).attr({fill:WHITE,opacity:0.5,class:"possible"});
	return {s:this.path,p:this.outlinepts};
    };
    turn(n) {
	this.m.add(MR(n,0,0));
	this.alpha+=n;
	this.show();
    };
    unselect() {
    };
    select() { 
	if (phase==SETUP_PHASE) {
	    var old=activeunit;
	    activeunit=this;
	    old.unselect();
	    this.showpanel();
	}
    };
    showpanel() { 
	Unit.prototype.showpanel.call(this); 
	$("#positiondial button").show();
    };
    dragmove(dx,dy,x,y) { Unit.prototype.dragmove.call(this,dx,dy,x,y); };
    dragstart(x,y,a) {
	var old=activeunit;
	old.unselect();
	activeunit=this;
	Unit.prototype.dragstart.call(this,x,y,a);
	Unit.prototype.showpanel.call(this);
	$("#positiondial button").show();
	this.dragshow(); 
    };
    dragshow() {
	for (var k=1; k<4; k++) 
	    this.o[k].transform(this.dragMatrix).attr({display:"block"}).appendTo(VIEWPORT);
	this.g.transform(this.dragMatrix);
	this.g.appendTo(VIEWPORT);
    };
    showhitsector() {};
    dragstop(a) { 
	for (var k=1; k<4; k++) 
	    this.o[k].attr({display:"none"});
	Unit.prototype.dragstop.call(this,a);
    };
    show() {
	this.g.transform(this.m);
	//this.g.appendTo(VIEWPORT);
    };
    setclickhandler(f) {
	this.g.unmousedown();
	this.g.mousedown(f);
    };
    setdefaultclickhandler() {
	this.g.unmousedown();
	this.g.mousedown(function() { this.select();}.bind(this));
    };
    selectrocks() {
	$(".aster").empty();
	var sa=Snap(".aster");
	var g=[];
	var rocks=TEAMS[this.team].rocks;
	var viewport=sa.g();
	var maxw=0,maxh=0;
	var k=0;
	var h=$(".aster").height();
	var w=$(".aster").width();
	var s=0.27; //h/2/600;
	var m1;
	var hh=0,kk=0;
	var self=this;
	var myid=rocks.indexOf(this.id);
	var coord=[this.tx,this.ty,this.alpha];
	var padebris = sa.image(DEBRISIMG,0,0,256,256).pattern(0,0,256,256);
	var parock = sa.image(ROCKIMG,0,0,256,256).pattern(0,0,256,256);
	var myob=OBSTACLES.indexOf(this);
	for (var i=0; i<ROCKS.length+DEBRISCLOUD.length; i++) {
	    //if (rocks.indexOf(i)>-1) continue;
	    if (i<ROCKS.length) {
		s=0.27;
		g[k]=sa.path(ROCKS[i]).attr({strokeWidth:3});
		g[k].attr({fill:parock,stroke:"#a00",id:"aster"+i,idk:k}).click(function() {
		    var n=parseInt(this.attr("id").match(/\d+/)[0],10);
		    var m = myid;
		    rocks[myid]=n;
		    OBSTACLES[myob].g.remove();
		    OBSTACLES[myob]=new Rock(n,coord,self.team,m);
		    console.log("change for rock "+this.attr("id")+" "+coord[0]+" "+coord[1]+" "+coord[2]);
		    activeunit=OBSTACLES[myob];

		    window.location="#";
		}).hover(function()  {g[parseInt(this.attr("idk"),10)].attr({fill:"#a00"});},
			 function()  {g[parseInt(this.attr("idk"),10)].attr({fill:parock});});
	    } else {
		s=0.4;
		g[k]=sa.path(DEBRISCLOUD[i-ROCKS.length]).attr({strokeWidth:3})
		g[k].attr({fill:padebris,stroke:"#a00",id:"deb"+(i-ROCKS.length),idk:k}).click(function() {
		    //console.log("MAXROCKS:"+MAXROCKS+" "+ROCKS.length);
		    var n=parseInt(this.attr("id").match(/\d+/)[0],10)+MAXROCKS;
		    var m = myid;
		    rocks[myid]=n;
		    OBSTACLES[myob].g.remove();
		    OBSTACLES[myob]=new Rock(n,coord,self.team,m);
		    console.log("change for debris "+this.attr("id")+" "+i);
		    activeunit=OBSTACLES[myob];
		    window.location="#";
		}).hover(function()  {g[parseInt(this.attr("idk"),10)].attr({fill:"#a00"});},
			 function()  {g[parseInt(this.attr("idk"),10)].attr({fill:padebris});});
	    }
	    var r=0;
	    var m=0;
	    if (k==13||k==12) { r=45; m=-40; }
	    m1=MT(kk*80+10,10+m+hh*80).rotate(r,0,0).scale(s,s);
	    g[k].transform(m1);
	    g[k].appendTo(viewport);
	    k++;
	    kk+=1;
	    if (kk>5) {
		kk=0;
		hh+=1;
	    }
	}
    }
}
var V1="v1",V2="v2";
var CURRENT_DECK=V2;
function Critical(sh,i) {
    this.lethal=false;
    $.extend(this,CRITICAL_DECK[i]);
    this.no=this.name+i;
    sh.criticals.push(this);
    this.isactive=false;
    this.unit=sh;
}

Critical.prototype= {
    toString: function() {
	var a,b,str="";
	var c="";
	if (!this.isactive) return "";
	var n=this.name;
	if (typeof CRIT_translation[this.name].name!="undefined") n=CRIT_translation[this.name].name;
	a="<td><code class='Criticalupg upgrades'></code></td>"; 
	b="<td class='tdstat'>"+n+"</td>";
	n="";
	if (typeof CRIT_translation[this.name].text!="undefined") n=formatstring(CRIT_translation[this.name].text)
	d="<td class='tooltip outoverflow'>"+n+"</td>";
	if (this.unit.team==1)  
	    return "<tr "+c+">"+b+a+d+"</tr>"; 
	else return "<tr "+c+">"+a+b+d+"</tr>";
    },
    log: function() {
	this.unit.log("Critical: %0",this.name);
	var n="";
	if (typeof CRIT_translation[this.name].text!="undefined") {
	    n=formatstring(CRIT_translation[this.name].text)
	    log("<ul><li>"+n+"</li></ul>");
	} else log("no translation:"+this.name);
    }
}
var CRITICAL_DECK=[
    {
	type:"ship",
	count: 2,
	init:2,
	name:"Structural Damage",
	version:[V2],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return a;
	    });
	},
	facedown:function() {
	    if (this.isactive) {
		this.unit.getagility.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit"||roll=="critical") {
		this.facedown();
	    } else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	},
    },
    {
	type:"ship",
	count: 2,
	init:2,
	name:"Structural Damage (original)",
	version:[V1],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return a;
	    });
	},
	facedown:function() {
	    if (this.isactive) {
		this.unit.getagility.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.unit.showstats();
	    }
	    this.isactive=false;
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit") {
		this.facedown();
	    } else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	},
    },
    {
	type:"ship",
	name:"Damaged Engine",
	version:[V1,V2],
	count: 2,
	init:2,
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    var save=[];
	    this.unit.wrap_after("getdial",this,function(a) {
		if (save.length==0) {
		    for (var i=0; i<a.length; i++) {
			save[i]={move:a[i].move,difficulty:a[i].difficulty};
			if (a[i].move.match(/TL\d|TR\d/)) save[i].difficulty="RED";
		    }
		}
		return save;
	    });
	},
	facedown: function() {
	    if (this.isactive) this.unit.getdial.unwrap(this);
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	name:"Console Fire",
	count: 2,
	init:2,
	version:[V1,V2],
	lethal:true,
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_before("begincombatphase",this,function() {
		var roll=this.rollattackdie(1,self,"blank")[0];
		if (roll=="hit") {
		    this.log("+1 %HIT% [%0]",this.name);
		    this.resolvehit(1); this.checkdead();
		}
	    });
	},
	action: function(n) {
	    this.facedown();
	    this.unit.endaction(n,"CRITICAL");
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.log("%0 repaired",this.name);		
		this.unit.begincombatphase.unwrap(this);
	    }
	    this.isactive=false;
	}
    },
    {
	type:"ship",
	count: 2,
	name:"Weapon Malfunction",
	version:[V1],
	faceup:function() {
	    this.log();
	    this.isactive=true;
	    for (var i=0; i<this.unit.weapons.length;i++) 
		if (this.unit.weapons[i].isprimary) break;
	    this.w=i;
	    this.unit.weapons[i].wrap_after("getattack",this,function(a) {
		if (a>0) return a-1; else return a;
	    });	    
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.weapons[this.w].getattack.unwrap(this);
		this.unit.log("%0 repaired",this.unit.weapons[this.w].name);
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="critical"||roll=="hit") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	type:"ship",
	count:2,
	init:2,
	name:"Damaged Sensor Array (original)",
	version:[V1],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getactionbarlist",this,function() { return [];});
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.getactionbarlist.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	type:"ship",
	count:2,
	init:2,
	name:"Damaged Sensor Array",
	version:[V2],
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getactionbarlist",this,function() { return [];});
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.getactionbarlist.unwrap(this);
		this.unit.log("%0 repaired",this.name);
		this.isactive=false;
	    }
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit"||roll=="critical") this.facedown();
	    else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    { 
	name:"Minor Explosion",
	count: 2,
	init:2,
	type:"ship",
	lethal:true,
	version:[V1],
	faceup: function() {
	    this.log();
	    var roll=this.unit.rollattackdie(1,this,"blank")[0]
	    this.isactive=false;
	    if (roll=="hit") this.unit.removehull(1); 
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    {
	name:"Thrust Control Fire",
	count: 2,
	init:2,
	version:[V1,V2],
	type:"ship",
	faceup: function() {
	    this.log();
	    this.unit.addstress();
	    this.isactive=false;
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    { 
	name:"Direct Hit!",
	count:7,
	init:2,
	version:[V1,V2],
	type:"ship",
	lethal:true,
	faceup: function() {
	    this.log();
	    //this.isactive=false;
	    this.unit.removehull(1);
	},
	facedown: function() {
	    this.isactive=false;
	    this.unit.hull++;
	}
    },
    {
	name:"Munitions Failure",
	count:2,
	init:2,
	type:"ship",
	version:[V1],
	lethal:true,
	faceup: function() {
	    this.log();
	    var m=[];
	    for (i=0; i<this.unit.weapons.length; i++) {
		if (this.unit.weapons[i].issecondary) m.push(this.unit.weapons[i]);
	    }
	    this.isactive=false;
	    if (m.length==0) return;
	    var w=this.unit.rand(m.length);
	    this.wp=m[w];
	    this.wp.isactive=false;
	    this.unit.log(this.wp.name+" not functioning anymore");
	    this.unit.show();
	},
	facedown: function() { this.isactive=false;
	}
    },
    {
	name:"Minor Hull Breach",
	count:2,
	init:2,
	type:"ship",
	lethal:true,
	version:[V1],
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.hd=this.unit.handledifficulty;
	    this.unit.wrap_after("handledifficulty",this,function(d) {
		var roll=this.rollattackdie(1,self,"blank")[0];
		if (roll=="hit"&&d=="RED") {
		    this.log("+1 %HIT% [%0]",self.name);
		    this.removehull(1);
		}
	    });
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.handledifficulty.unwrap(this);
		this.isactive=false;
		this.unit.log("%0 repaired",this.name);
	    }
	}
    },
    { 
	name:"Damaged Cockpit",
	count:2,
	init:2,
	type:"pilot",
	version:[V1,V2],
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_before("endround",this,function() {
		this.wrap_after("getskill",self,function() {
		    return 0;
		});
		filltabskill();
		this.showstats();
	    }.bind(this.unit));
	},
	facedown: function() {
	    if (this.isactive) {
		this.isactive=false;
		this.unit.getskill.unwrap(this);
		filltabskill();
		this.unit.showstats();
	    }
	}
    },
    { 
	name:"Blinded Pilot",
	count:2,
	init:2,
	version:[V1,V2],
	type:"pilot",
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("getattackstrength",this,function(w,t,a) { this.getattackstrength.unwrap(self); self.isactive=false; return 0; });
	},
	facedown: function() {
	    this.isactive=false;
	}
    },
    { 
	name:"Injured Pilot",
	count:2,
	init:2,
	type:"pilot",
	lethal:true,
	version:[V1],
	faceup: function() {
	    this.log();
	    var i;
	    this.isactive=true;
	    for (i=0; i<this.unit.upgrades.length; i++) {
		var upg=this.unit.upgrades[i];
		if (upg.type==ELITE) upg.desactivate();
	    }
	    this.unit.desactivate();
	    this.unit.show();
	},
	facedown: function() {
	    if (this.isactive) {
		var i;
		if (typeof this.unit.init!="undefined") this.unit.init();
		for (i=0; i<this.unit.upgrades.length; i++) {
		    var upg=this.unit.upgrades[i];
		    if (upg.type==ELITE) {
			upg.isactive=true;
			if (typeof upg.init!="undefined") upg.init(this.unit);
		    }
		}
		this.unit.show();
	    }
	    this.isactive=false;
	}
    },
    { 
	name:"Stunned Pilot",
	count:2,
	init:2,
	version:[V1,V2],
	type:"pilot",
	lethal:true,
	faceup: function() {
	    var self=this;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_before("resolvecollision",this,function() {
		this.log("+1 %HIT% [%0]",self.name);
		this.resolvehit(1);
	    });
	    this.unit.wrap_before("resolveocollision",this,function() {
		this.log("+1 %HIT% [%0]",self.name);
		this.resolvehit(1);
	    });
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.unwrap("resolvecollision",this);
		this.unit.unwrap("resolveocollision",this);
		this.unit.log("no longer stunned");
	    }
	    this.isactive=false;
	}
    },
    {
	name:"Loose Stabilizer",
	count:2,
	init:2,
	type:"ship",
	faceup: function() {
	    var self=this;
	    this.log();
	    this.unit.wrap_after("handledifficulty",this,function(d) {
		if (d=="WHITE") this.addstress();
	    });
	},
	facedown: function() {
	    if (this.isactive) {
		this.unit.unwrap("handledifficulty",this);
		this.unit.log("%0 repaired",this.name);
	    }
	    this.isactive=false;
	},
	version:[V2],
    },
    {
	name:"Major Explosion",
	count:2,
	init:2,
	type:"ship",
	lethal:true,
	faceup:function() {
	    var self=this;
	    this.log();
	    var roll=this.unit.rollattackdie(1,this,"blank")[0];
	    if (roll=="hit") {
		this.unit.log("+1 %CRIT% [%0]",this.name);
		this.unit.resolvecritical(1);
	    }
	    this.isactive=false;
	},
	facedown:function() {},
	version:[V2],
    },
    { 
	name:"Major Hull Breach",
	count:2,
	init:2,
	type:"ship",
	lethal:true,
	version:[V2],
	faceup:function() {
	    var myround=round;
	    this.log();
	    this.isactive=true;
	    this.unit.wrap_after("deal",this,function(crit,face,p) {
		if (round==myround) return p;
		var dd=$.Deferred();
		p.done(function(c) {
		    c.face=FACEUP;
		    dd.resolve(c);
		});
		return dd.promise();
	    });
	},
	facedown: function() {
	    if (this.isactive) this.unit.deal.unwrap(this);
	    this.isactive=false;
	},
	action: function(n) {
	    this.facedown();
	    this.unit.endaction(n,"CRITICAL");
	}
    },
    {
	name:"Shaken Pilot",
	count:2,
	init:2,
	type:"pilot",
	faceup: function() {
	    this.log();
	    this.isactive=true;
	    var save=[];
	    var self=this;
	    this.unit.wrap_after("getdial",this,function(a) {
		if (save.length==0) {
		    for (var i=0; i<a.length; i++) {
			if (!a[i].move.match(/F1|F2|F3|F4|F5/)) 
			    save.push({move:a[i].move,difficulty:a[i].difficulty});
		    }
		}
		return save;
	    });
	    this.unit.wrap_after("timeformaneuver",this,function(t) {
		if (t&&!this.hasionizationeffect()) self.facedown();
		return t;
	    });	    
	},
	facedown: function() {
	    if (this.isactive) {
		this.isactive=false;
		this.unit.getdial.unwrap(this);
		this.unit.timeformaneuver.unwrap(this);
	    }
	},
	version:[V2],
    },
    {
	name:"Weapons Failure",
	count:2,
	init:2,
	type:"ship",
	faceup: function() {
	    for (var i in this.weapons) 
		this.weapons[i].wrap_after("getattack",this,function(a) { return (a>0)?a-1:a; }); 
	},
	facedown: function() {
	    for (var i in this.weapons) 
		this.weapons[i].getattack.unwrap(this);
	},
	action: function(n) {
	    var roll=this.unit.rollattackdie(1,this,"hit")[0];
	    if (roll=="hit"||roll=="critical") {
		this.facedown();
	    } else this.unit.log("%0 not repaired",this.name);
	    this.unit.endaction(n,"CRITICAL");
	},
	version:[V2],
    }
];
function Condition(sh,org,n) {
    this.name=n;
    this.org=org;
    if (n in  TEAMS[sh.team].conditions) {
	TEAMS[sh.team].conditions[n].remove();
    }
    $.extend(this,CONDITIONS[n]);
    console.log("new condition: "+n+" to "+sh.name+" from "+this.org.name);
    sh.conditions[n]=this;
    TEAMS[sh.team].conditions[n]=this;
    this.unit=sh;
    this.isactive=true;
    this.assign(sh);
    activeunit=sh;
    sh.show();
    activeunit=org;
}
Condition.prototype = {
    toString: function() {
	if (!this.isactive) return "";
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	return Mustache.render(TEMPLATES["condition"], this);
    },
    remove: function() {
	var u=this.unit;
	Unit.prototype.desactivate.call(this);
	delete u.conditions[this.name];
	delete TEAMS[u.team].conditions[this.name];
	u.show();
    }
} 
var CONDITIONS={
    "I'll Show You The Dark Side": {
	assign: function(t) {
	    var self=this;
	    var sc=[];
	    for (var i=0; i<CRITICAL_DECK.length; i++) {
		if (CRITICAL_DECK[i].version.indexOf(CURRENT_DECK)>-1
		    &&CRITICAL_DECK[i].type=="pilot"&&CRITICAL_DECK[i].count>0) 
		    sc.push(i);
	    }
	    this.org.selectcritical(sc,function(m) {
		CRITICAL_DECK[m].count--;
		t.darkside=new Critical(t,m);
		var name=CRITICAL_DECK[m].name;
		if (typeof CRIT_translation[name].name!="undefined") name=CRIT_translation[n].name;
		
		self.name+=" ["+name+"]";
	    });
	    t.wrap_after("deal",this,function(cr,f,dd) {
		if (f==FACEUP) {
		    var ddd=$.Deferred();
		    self.remove();
		    return ddd.resolve({crit:this.darkside,face:f});
		} else return dd;
	    }).unwrapper("deal");
	}
    },
    "Suppressive Fire":{
	assign: function(target) {
	    var self=this;
	    target.wrap_after("getattackstrength",this,function(i,t,d) {
		if (t.name!=self.org.name&&self.isactive&&self.unit==this) return d-1;
		return d;		
	    });
	    target.wrap_after("declareattack",this,function(w,t,b) {
		if (b&&t.name==self.org.name&&self.isactive&&self.unit==this) self.remove();
		return b;
	    });
	    this.org.wrap_before("dies",this,function() {
		self.remove();
	    });
	    this.org.wrap_before("endcombatphase",this,function() {
		if (this.hasfired==0) self.remove();
	    });
	}
    },
    "A Debt To Pay":{
	assign: function(t) {
	    var self=this;
	    t.adebttopay=self;
	    t.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    if (typeof targetunit.ascoretosettle!="undefined")
			return targetunit.ascoretosettle.isactive;
		    return false;
		},
	     f:function(m,n) {
		 this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
		 m = m - FCH_FOCUS + FCH_CRIT;
		 return m;
	     }.bind(t),str:"elite"});

	},
    },
    "Fanatical Devotion":{
	assign: function(t) {
	    var self=this;
	    t.wrap_before("isattackedby",this,function() {
		this.wrap_after("canusefocus",self,function() { return false;}).unwrapper("endbeingattacked");
	    });
	    t.wrap_before("endround",this,function() {
		self.remove();
	    });
	    t.wrap_after("declareattack",this,function(w,target,b) {
		if (b) this.wrap_after("removefocustoken",self,function() {
		    var u=this;
		    Unit.prototype.wrap_after("cancelcritical",self,function(r,sh,s) {
			return {ch:s.ch+FCH_HIT,e:s.e}; 
		    }).unwrap("endbeingattacked");
		}).unwrap("endattack");
		return b;
	    }).unwrap("endattack");
	}
    }
}
/*
TODO: collision with two maneuvers (ailerons)
      collision when starting form above an asteroid
      timing of revealing a maneuver. Simpler written
      two maneuvers for daredevil (similar to slam and ailerons)

 */
var FAST=false;
var s;
var BLACK="#111",GREEN="#0F0",RED="#F00",WHITE="#FFF",BLUE="#0AF",YELLOW="#FF0",GREY="#888";
var HALFBLACK="#222",HALFGREEN="#080",HALFRED="#800",HALFWHITE="#888",HALFBLUE="#058",HALFYELLOW="#880",HALFGREY="#444";
var TIMEANIM=FAST?0:1000;
var FACE=["focus","hit","critical","evade","blank"];
var ATTACKDICE= [0,0,1,1,1,2,4,4];
var DEFENSEDICE=[0,0,3,3,3,4,4,4];
var MPOS={ F0:[0,3],RL1:[0,2],RR1:[0,4],RF1:[0,3],F1:[1,3],F2:[2,3],F3:[3,3],F4:[4,3],F5:[5,3],	
	   BL1:[1,2],BL2:[2,2],BL3:[3,2],
	   TL1:[1,1],TL2:[2,1],TL3:[3,1],
	   BR1:[1,4],BR2:[2,4],BR3:[3,4],
	   TR1:[1,5],TR2:[2,5],TR3:[3,5],
	   K1:[1,7],K2:[2,7],K3:[3,7],K4:[4,7],K5:[5,7],
	   SL2:[2,0],SL3:[3,0],
	   SR2:[2,6],SR3:[3,6],
	   TRL3:[3,0],TRR3:[3,6],
	   TRL2:[2,0],TRR2:[2,6]
	 };
var REBEL="REBEL",EMPIRE="EMPIRE",SCUM="SCUM";
var ILLICIT="Illicit",ELITE="Elite",TURRET="Turret",MISSILE="Missile",ASTROMECH="Astromech",TORPEDO="Torpedo",CANNON="Cannon",BOMB="Bomb",TECH="Tech",CREW="Crew",SYSTEM="System",SALVAGED="Salvaged",MOD="Mod",TITLE="Title",ROCK="Rock",DEBRIS="Debris",NONE="None",CONDITION="Condition";
var NOLOG=false;
var generics=[];
var gid=0;
var REROLL_M=0,ADD_M=1,MOD_M=2;
var ATTACK_M=0,DEFENSE_M=1,ATTACKCOMPARE_M=2;
var FACEUP=1,FACEDOWN=2,DISCARD=0;
var xws_lookup=function(s) {
    for (var i in PILOT_dict) {
	if (PILOT_dict[i]==s) return i;
    }
    return "";
};
var upg_lookup=function(s) {
    for (var i in UPGRADE_dict) {
	if (UPGRADE_dict[i]==s) return i;
    }
    return "";
};
	  
var activeunit;
var unitlist;
var pilotlist;
var squadron=[];
var active=0;
var globalid=1;
var targetunit;
var PATTERN;
var SOUND_DIR="ogg/";
var SOUND_FILES=[
    "cloak_romulan",
    "decloak_romulan",
    "EXPLODE3",
    "KX9_laser_cannon",
    "TIE-Fire",
    "Slave1-Guns",
    "Falcon-Guns",
    "XWing-Fly1",
    "TIE-Fly2",
    "Slave1-Fly1",
    "Falcon-Fly1",
    "Falcon-Fly3",
    "YWing-Fly2",
    "ISD-Fly",
    "missile",
    "XWing-Fly2",
    "DStar-Gun4",
    "TIE-Fly6",
    "Slave1-Fly2",
    "ghost"
];
var SOUNDS={};
var SOUND_NAMES=["cloak","decloak","explode","xwing_fire","tie_fire","slave_fire","falcon_fire","xwing_fly","tie_fly","slave_fly","falcon_fly","yt2400_fly","ywing_fly","isd_fly","missile","xwing2_fly","dstar_gun","tie2_fly","slave2_fly","ghost"];
function loadsound() {
    var i,j;
    var sound={"explode":2,"cloak":0,"decloak":1};
    for (i=0; i<squadron.length; i++) {
	var fs=squadron[i].ship.firesnd;
	sound[fs]=SOUND_NAMES.indexOf(fs);
	if (SOUND_NAMES.indexOf(fs)==-1) console.log("cannot find fire sound for "+fs+"/"+squadron[i].ship.name);
	fs=squadron[i].ship.flysnd;
	sound[fs]=SOUND_NAMES.indexOf(fs);
	if (SOUND_NAMES.indexOf(fs)==-1) console.log("cannot find sound for "+fs+"/"+squadron[i].ship.name);
	for (j=1; j<squadron[i].weapons.length; j++) {
	    fs=squadron[i].weapons[j].firesnd;
	    sound[fs]=SOUND_NAMES.indexOf(fs);
	    if (SOUND_NAMES.indexOf(fs)==-1) console.log("cannot find fire sound for "+fs+"/"+squadron[i].weapons[j].name);
	}
	    
    }
    for (i in sound) {
	SOUNDS[i]=new Howl({
	    urls: [SOUND_DIR+SOUND_FILES[sound[i]]+".ogg", SOUND_DIR+SOUND_FILES[sound[i]]+".m4a", SOUND_DIR+SOUND_FILES[sound[i]]+".wav"],
	    autoplay:false,
	    loop:false
	});
    }

}
function transformPoint(matrix,point)  {
    var dx = point.x * matrix.a + point.y * matrix.c + matrix.e;
    point.y = point.x * matrix.b + point.y * matrix.d + matrix.f;
    point.x = dx;
    return point;
} 

function halftone(c) {
    if( c==GREEN) return HALFGREEN;
    if (c==RED) return HALFRED;
    if (c==WHITE) return HALFWHITE;
    if (c==BLUE) return HALFBLUE;
    if (c==YELLOW) return HALFYELLOW;
    if (c==GREY) return HALFGREY;
    return c;
}

var MS = function(x,y) { return (new Snap.Matrix().scale(x,y));};
var MT = function(x,y) { return (new Snap.Matrix()).translate(x,y); };
var MR = function(a,x,y) { return (new Snap.Matrix()).rotate(a,x,y); };
var C = { GREEN:"#0F0",RED:"#F00",WHITE:"#FFF" };
var P;
// Table of actions
var A = {
    CONDITION:{key:"R",color:YELLOW}, /* TODO */
    ARCROTATE:{key:"R",color:GREEN},
    ROLL:{key:"r",color:GREEN},
    SLAM:{key:"s",color:BLUE},
    COORDINATE:{key:"o",color:GREEN},
    FOCUS:{key:"f",color:GREEN},
    TARGET:{key:"l",color:BLUE},
    EVADE:{key:"e",color:GREEN},
    BOOST:{key:"b",color:GREEN},
    STRESS:{key:"?",color:RED},
    CLOAK:{key:"k",color:BLUE},
    ISTARGETED:{key:"l",color:RED},
    ASTROMECH:{key:"A",color:YELLOW},
    CANNON:{key:"C",color:YELLOW},
    CREW:{key:"W",color:YELLOW},
    MISSILE:{key:"M",color:YELLOW},
    TORPEDO:{key:"P",color:YELLOW},
    ELITE:{key:"E",color:YELLOW},
    TURRET:{key:"U",color:YELLOW},
    UPGRADE:{key:"S",color:YELLOW},
    CRITICAL:{key:"c",color:RED},
    SALVAGED:{key:"V",color:YELLOW},
    BOMB:{key:"B",color:YELLOW},
    TITLE:{key:"t",color:YELLOW},
    MOD:{key:"m",color:YELLOW},
    SYSTEM:{key:"S",color:YELLOW},
    ILLICIT:{key:"I",color:YELLOW},
    LASER:{key:"%",color:RED},
    TURRETLASER:{key:"$",color:RED},
    BILASER:{key:"<",color:RED},
    MOBILELASER:{key:"<",color:RED},
    LASER180:{key:">",color:RED},
    NOTHING:{key:"&nbsp;",color:WHITE},
    HIT:{key:"d",color:WHITE},
    SHIELD:{key:"v",color:YELLOW},
    TECH:{key:"X",color:WHITE},
};
var AINDEX = ["ROLL","FOCUS","TARGET","EVADE","BOOST","STRESS","CLOAK","ISTARGETED","ASTRO","CANNON","CREW","MISSILE","TORPEDO","ELITE","TURRET","UPGRADE","CRITICAL","NOTHING"];

function repeat(pattern, count) {
    var result = '';
    for (var i=0; i<count; i++) result+=pattern;
    return result;
}

function dist(p1,p2) {
    return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
}
function Unit(team,pilotid) {
    var i;
    this.dead=false;
    this.isdocked=false;
    this.ship={};
    this.id=gid;
    this.life=1;
    this.arcrotation=180;
    this.wrapping=[];
    var id=this.id;
    generics["u"+gid]=this;
    gid++;
    this.maxupg=[];
    this.exclupg=[];
    this.team=team;
    this.faction=TEAMS[team].faction;
    this.shipactionList=[];
    this.dial=[];
    this.ordnance=false;
    this.dialselect="<table class='dial' id='dial"+id+"'></table>";
    this.text="<span id='text"+id+"' class='details'></span>";
    this.upgradesno=0;
    this.upgrades=[];
    this.criticals=[];
    this.conditions={};
    this.DEFENSEREROLLD=[];
    this.ATTACKREROLLA=[];
    this.ATTACKMODA=[];
    this.ATTACKADD=[];
    this.DEFENSEMODD=[];
    this.DEFENSEADD=[];
    this.tx=this.ty=this.alpha=0.;
    if (typeof PILOTS[pilotid]=="undefined") {
	this.error("pilot does not exists "+pilotid);
	return;
    }
    var u=unitlist[PILOTS[pilotid].unit];
    this.ship={
	shield:u.shield,
	hull:u.hull,
	firesnd:u.firesnd,
	flysnd:u.flysnd,
	name:PILOTS[pilotid].unit,
	hastitle:u.hastitle,
    };
    if (typeof PILOTS[pilotid].shipimg=="undefined") {
	var t=u.faction.indexOf(this.faction);
	if (t==-1) t=0;
	this.shipimg=u.img[t];
    } else this.shipimg=PILOTS[pilotid].shipimg;
    this.scale=u.scale;
    this.islarge=(u.islarge==true)?true:false;
    this.hull=u.hull;
    this.shield=u.shield;
    this.agility=u.evade;
    this.hasmobilearc=(u.weapon_type=="Mobilelaser");
    for (i=0; i<u.dial.length; i++) {
	this.dial[i]={move:u.dial[i].move, difficulty:u.dial[i].difficulty};
    }
    this.shipactionList=u.actionList.slice(0);
    this.weapons=[];
    this.upgrades=[];
    this.criticals=[];
    this.conditions={};
    this.bombs=[];
    this.lastdrop=-1;
    Laser(this,u.weapon_type,u.fire);

    this.name=PILOTS[pilotid].name;
    this.pilotid=pilotid;
    this.unique=PILOTS[pilotid].unique==true?true:false;
    this.skill=PILOTS[pilotid].skill;
    this.install=(typeof PILOTS[pilotid].install!="undefined")?PILOTS[pilotid].install:function() {};
    this.uninstall=(typeof PILOTS[pilotid].uninstall!="undefined")?PILOTS[pilotid].uninstall:function() {};
    var up=PILOTS[pilotid].upgrades;
    this.upg=[];
    this.upgbonus=[];
    for (j=0; j<10; j++) {this.upg[j]=-1};
    this.upgradetype=[];
    for (k=0; k<up.length; k++) this.upgradetype[k]=up[k];
    this.upgradetype[k++]=MOD;
    if (unitlist[this.ship.name].hastitle) {
	this.upgradetype[k++]=TITLE;
    }
    this.upgradesno=k;
    this.points=PILOTS[pilotid].points;
	this.addedattack=-1;
	this.noattack=-1;
	this.addedattack2=-1;
	this.usedweapon=-1;
	this.activeweapon=-1;
	this.touching=[];
	this.maneuver=-1;
	this.action=-1;
	this.actionsdone=[];
	this.hasmoved=false;
	this.hasdecloaked=false;
	this.reroll=0;
	this.focus=0;
	this.tractorbeam=0;
	this.lastmaneuver=-1;
	this.iscloaked=false;
	this.istargeted=[];
	this.targeting=[];
	this.stress=0;
	this.ionized=0;
	//this.removeionized=false;
	this.evade=0;
	this.hasfired=0;
	this.maxfired=1;
	this.hitresolved=0;
	this.criticalresolved=0;
	this.m=new Snap.Matrix(); 
	this.collision=false;
	this.oldoverlap=-1;
	this.ocollision={overlap:-1,template:[],mine:[]};


    this.install(this);
    if (this.team>=0&&this.team<3) TEAMS[this.team].updatepoints();
    if (typeof this.init!="undefined") this.init();
}
Unit.prototype = {
    tosquadron: function(s) {
	var i,j;
	var upgs=this.upg;

	var uu=[];
	for (j in upgs) if (upgs[j]>-1) uu.push(Upgradefromid(this,upgs[j]));
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	var img=this.shipimg;

	if (!(this.islarge)) {
	    if (typeof this.shipimg!="undefined") {
		img=this.shipimg;
	    }
	    if (typeof img=="undefined") 
		this.img=s.text(-10,10,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction==SCUM)?'r -1 1':'')).attr({
		class:"xwingship",
	    }); else 	    this.img=s.image("png/"+img,-20*this.scale,-20*this.scale,40*this.scale,40*this.scale).transform('r 90 0 0').attr({ pointerEvents:"none"});


	    this.imgsmoke= s.image("png/smoke.gif",-20,-60,30,50).transform('r 180 0 0').attr({display:"none"});
	    this.imgflame=s.image("png/out.gif",-15,-40,20,40).transform('r 180 0 0').attr({display:"none"});
	} else {
	    if (typeof img=="undefined") 
	    this.img=s.text(0,0,this.ship.code).transform('r -90 0 0 '+((this.faction=="EMPIRE"||this.faction==SCUM)?'s 2 -2':'s 2 2')+'t -15 5').attr({
		class:"xwingship",
	    });
	    else this.img=s.image("png/"+this.shipimg,-50*this.scale,-50*this.scale,100*this.scale,100*this.scale).transform('r 90 0 0');
	    this.imgsmoke= s.image("png/smoke.gif",-20,-60,30,50).transform('r 180 0 0').attr({display:"none"});
	    this.imgflame=s.image("png/out.gif",-15,-40,20,40).transform('r 180 0 0').attr({display:"none"});
	    
	}
	var w=(this.islarge)?40:20;
	this.outline = s.rect(-w,-w,2*w,2*w).attr({
            fill: "rgba(8,8,8,0.5)",
            strokeWidth: 2,
	});
	this.border = s.rect(-w,-w,2*w,2*w).attr({
	    fill:"rgba(0,0,0,0)",
	    strokeWidth: 2,
	    stroke:halftone(this.color),
	});
	this.tohitstats={};
	this.tohit = s.text(-w,w-30,"0").attr({class:"tohit",strokeWidth:1});
	this.meanhit = s.text(-w,w-15,"0").attr({class:"tohit",strokeWidth:1});
	this.meanhitsymbol = s.text(-w+40,w-15,"0").attr({class:"symbols",strokeWidth:0,text:"d"});
	this.meancrit = s.text(-w,w,"0").attr({class:"tohit",strokeWidth:1});
	this.meancritsymbol = s.text(-w+40,w,"0").attr({class:"symbols",strokeWidth:0,text:"c"});
	this.gproba = s.group(this.tohit,this.meanhit,this.meanhitsymbol,this.meancrit,this.meancritsymbol).attr({display:"none",fontSize:"15",stroke:"#fff",fill:"#fff",opacity:1});
	this.skillbar=s.text(1-w,3-w,repeat('u',this.skill))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#fa0",
	    });
	this.firebar=s.text(1-w,5-w,repeat('u',this.weapons[0].attack))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#f00",
	    });
	this.evadebar=s.text(1-w,7-w,repeat('u',this.agility))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#0f0",
	    });
	this.hullbar=s.text(1-w,9-w,repeat('u',this.hull))
	    .transform('r -90 0 0').attr({
		class: "xsymbols",
		fill:"#cc0",
	    });
	this.shieldbar=s.text(1-w,9-w,repeat('u',this.shield+this.hull))
	    .transform('r -90 0 0').attr({
	    class: "xsymbols",
		fill:"#0af",
	    });
	this.gstat=s.group(this.skillbar,this.firebar,this.evadebar,this.shieldbar,this.hullbar,this.gproba).attr({pointerEvents:"none"});
	this.dialspeed = s.text(2+w,3-w,"").attr({class: "dialspeed",pointerEvents:"none"});
	this.dialdirection = s.text(w+8,3-w,"").attr({class: "symbols",pointerEvents:"none" });
	this.actionicon = s.text(w+2,-7,"").attr({pointerEvents:"none",class: "symbols",strokeWidth:0});
	this.sector = s.polygon(3-w,-w,0,0,w-3,-w).attr({
	    fill: this.color,
	    opacity:0.5,
	    strokeWidth: 0
	});
	this.ranges=[];
	this.sectors=[];
	this.infoicon=[];

	var i;
	for(i=0; i<6; i++) {
	    this.infoicon[i]=s.text(w-7,6-w+7*i,A[AINDEX[i+2]].key)
		.attr({pointerEvents:"none",
		       class: "xsymbols",
		       fill:A[AINDEX[i+2]].color,
		       strokeWidth: 0
		      });
	}
	this.geffect=s.group(this.imgflame,this.imgsmoke).attr({pointerEvents:"none"});
	// Order in the group is important. Latest is on top of stacked layers
	this.g=s.group(this.sector,this.outline,this.img,this.border,this.dialspeed,this.dialdirection,this.actionicon,this.infoicon[0],this.infoicon[1],this.infoicon[2],this.infoicon[3],this.infoicon[4],this.infoicon[5],this.gstat);
	VIEWPORT.add(this.g);
	VIEWPORT.add(this.geffect);
	this.g.addClass("unit");
	this.g.hover(
	    function () { 
		this.setinfo(translate(this.name));
	    }.bind(this),
	    function() { $(".info").hide(); 
		       }.bind(this));
	this.setdefaultclickhandler();

	this.upgrades.sort(function(a,b) { 
	    var pa=(a.isWeapon()?4:0)+(a.isBomb()?1:0); 
	    var pb=(b.isWeapon()?4:0)+(b.isBomb()?1:0);
	    return pb-pa;;
	});
	this.g.drag(this.dragmove.bind(this),
		    this.dragstart.bind(this),
		    this.dragstop.bind(this));
    },
    setinfo: function(info) {
	var m=VIEWPORT.m.clone();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var max=Math.max(900./w,900./h);
	
	var bbox=this.g.getBBox();
	var p=$("#svgout").offset();
	var min=Math.min($("#playmat").width(),$("#playmat").height());
	var x=m.x(bbox.x,bbox.y-20)/max;
	x+=p.left+startX;
	var y=m.y(bbox.x,bbox.y-20)/max;
	y+=p.top+startY;
	return $(".info").css({left:x,top:y}).attr({pointerEvents:"none"}).html(formatstring(info)).appendTo("body").show();
    },
    wrap_after: function (name,org,after,unwrap) {
	var self=this;
	var save=self[name];
	if (typeof self[name].save=="undefined"&&this!=Bomb.prototype&&this!=Unit.prototype&&this!=Weapon.prototype) self[name].save=self.__proto__[name];
	if (typeof save=="undefined") console.log("name"+name+" undefined");
	var f=function () {
            var args = Array.prototype.slice.call(arguments),result;
	    result=save.apply( this, args);
            result=after.apply( this, args.concat([result]));
	    return result;
	}
	f.save=save;
	f.org=org;
	if (typeof org.wrapping=="undefined") org.wrapping=[];
	org.wrapping.push({name:name,wrap:this});
	if (typeof save.vanilla!="undefined") f.vanilla=save.vanilla;
	else f.vanilla=save;
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,org,function(a) {
		f.unwrap(org);
		uw.unwrap(org);
		self.show();
		return a;
	    });
	}
	save.next=f;
	f.unwrap=function(o) {
	    if (f.org==o) {
		f.save.next=f.next;
		if (typeof f.next=="undefined") self[name]=f.save;
		if (name=="getskill") {
		    filltabskill();
		}
		self.show();
		return f.save;
	    } else if (typeof f.save.unwrap=="function") {
		f.save=f.save.unwrap(o);
	    }
	    self.show();
	    return f;
	}
	this[name]=f;
	if (name=="getskill") {
	    filltabskill();
	}
	return f;
    },
    desactivate:function() {
	for (var i in this.wrapping) {
	    var w=this.wrapping[i];
	    if (typeof w.wrap[w.name].unwrap=="function") {
		w.wrap[w.name].unwrap(this);
	    }
	}
	this.isactive=false; 
    },
    wrap_before: function(name,org,before,unwrap) {
	var self=this;
	var save=self[name];
	if (typeof self[name].save=="undefined"&&this!=Bomb.prototype&&this!=Unit.prototype&&this!=Weapon.prototype) self[name].save=self.__proto__[name];
	if (typeof save=="undefined") console.log("name"+name+" undefined");
	var f=function () {
            var args = Array.prototype.slice.call(arguments),
            result;
            before.apply( this, args);
            result = save.apply( this, args);
	    return result;
	}
	f.save=save;
	f.org=org;
	if (typeof save=="undefined") console.error("org:"+org.name+" "+name);
	if (typeof org.wrapping=="undefined") org.wrapping=[];
	org.wrapping.push({name:name,wrap:this});
	if (typeof save.vanilla!="undefined") f.vanilla=save.vanilla;
	else f.vanilla=save;
	f.unwrapper=function(name2) {
	    var uw=self.wrap_before(name2,org,function() {
		f.unwrap(org);
		uw.unwrap(org);
		self.show();
	    });
	}
	save.next=f;
	f.unwrap=function(o) {
	    if (f.org==o) {
		f.save.next=f.next;
		if (typeof f.next=="undefined") self[name]=f.save;
		self.show();
		return f.save;
	    } else if (typeof f.save.unwrap=="function") f.save=f.save.unwrap(o);
	    return f;
	}
	this[name]=f;
	return f;
    },
    toJSON: function() {
	var s={};
	s.name=xws_lookup(this.name);
	s.points=PILOTS[this.pilotid].points;
	s.ship=xws_lookup(this.ship.name);
	var upgpt={};
	var pointsreduction={};
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u>-1&&typeof u!="undefined") {
		var up=UPGRADES[u];
		if (typeof upgpt[upg_lookup(up.type)]=="undefined") upgpt[upg_lookup(up.type)]=[];
		s.points+=up.points;
		if (typeof UPGRADES[u].pointsupg!="undefined") {
		    for (var j=0; j<UPGRADES[u].upgrades.length; j++)
			pointsreduction[UPGRADES[u].upgrades[j]]=UPGRADES[u].pointsupg;
		}
		upgpt[upg_lookup(up.type)].push(upg_lookup(up.name))
	    }
	}
	for (var i=0; i<this.upg.length; i++) {
	    var u=this.upg[i];
	    if (u>-1&&typeof u!="undefined") {
		if (typeof pointsreduction[UPGRADES[u].type]!="undefined") {
		    var r=pointsreduction[UPGRADES[u].type];
		    if (UPGRADES[u].points+r>0) s.points+=r;
		    else s.points-=UPGRADES[u].points;
		}
	    }
	}
	this.points=s.points;
	s.upgrades=upgpt;
	return s;
    },
    toJuggler: function(translated) {
	var s=this.name;
	if (translated==true) s=translate(this.name);
	s=s.replace(/\'/g,""); 
	if (PILOTS[this.pilotid].ambiguous==true
	    &&typeof PILOTS[this.pilotid].edition!="undefined") 
	    s=s+"("+PILOTS[this.pilotid].edition+")";
	for (var i=0; i<this.upg.length; i++) {
	    var upg=this.upg[i];
	    if (upg>-1) {
		var v=UPGRADES[upg].name;
		if (translated==true) v=translate(UPGRADES[upg].name);
		s += " + "+v.replace(/\(Crew\)/g,"").replace(/\'/g,"");		
	    }
	}
	return s;
    },
    toASCII: function() {
	var s=this.pilotid;
	for (var i=0; i<this.upgrades.length; i++) {
	    var u=this.upgrades[i].id;
	    if (u>-1) s+=","+u;
	}
	s+=":"+Math.floor(this.tx)+","+Math.floor(this.ty)+","+Math.floor(this.alpha);
	return s;
    },
    toKey: function() {
	var s=("00"+this.pilotid.toString(32)).slice(-2);
	var p=[];
	for (var i=0; i<this.upg.length; i++) 
	    if (this.upg[i]>-1) p.push(this.upg[i]);
	p.sort();
	for (var i=0; i<p.length; i++) s+=("00"+p[i].toString(32)).slice(-2);
	return s;	
    },
    setpriority:function(action) {
	var PRIORITIES={"FOCUS":3,"EVADE":1,"CLOAK":4,"TARGET":2,"CRITICAL":100};
	var p=PRIORITIES[action.type];
	if (typeof p=="undefined") p=0;
	action.priority=p;
	var pl=[];
	if (action.type=="BOOST") pl=this.getboostmatrix(this.m);
	if (action.type=="ROLL") pl=this.getrollmatrix(this.m);
	if (pl.length>0) {
	    var old=this.m;
	    var e=this.evaluateposition();
	    var emove=e-1;
	    for (i=0; i<pl.length; i++) {
		this.m=pl[i];
		emove=Math.max(emove,this.evaluateposition());
	    }
	    this.m=old;
	    if (emove>e) action.priority=2*(emove-e);
	}
    }, 
    getstatstring:function() {
	var str="";
	str+="<div class='xsymbols RED'>"+repeat('u',this.weapons[0].getattack())+"</div>"
	str+="<div class='xsymbols GREEN'>"+repeat('u',this.getagility())+"</div>"
	str+="<div class='xsymbols YELLOW'>"+repeat('u',this.hull)+"</div>"
	str+="<div class='xsymbols BLUE'>"+repeat('u',this.shield)+"</div>";
	return str;
    },
    getupgradeaddstring:function() {
	var str="";
	for (var j=0; j<this.upgradetype.length; j++)
	    if (this.upg[j]==-1) 
		str+="<button num="+j+" class='upgrades "+(this.upgradetype[j]).replace(/\|/g,"")+"'><sup class='label'>"+this.getupgradelist(this.upgradetype[j]).length+"</sup></button>";
	return str;
    },
    showskill: function() {
	$("#unit"+this.id+" .statskill").html(this.getskill());
    },
    showupgradeadd:function() {
	$("#unit"+this.id+" .upgavail").html(this.getupgradeaddstring());
	addupgradeaddhandler(this);
    },
    getagility: function() {
	if (phase==COMBAT_PHASE) return this.agility-this.tractorbeam;
	return this.agility;
    },
    getskill: function() {
	return this.skill;
    },
    getdial: function() {
	if (this.hasionizationeffect()) return [{move:"F1",difficulty:"WHITE"}];
	return this.dial;
    },
    doplan: function() { this.showdial(); return this.deferred; },
    getdialstring: function() {
	var m=[];
	var str="";
	for (j=0; j<=5; j++) {
	    m[j]=[];
	    for (k=0; k<=7; k++) m[j][k]="<td></td>";
	}
	var gd=this.getdial();
	for (j=0; j<gd.length; j++) {
	    d=gd[j];
	    var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
	    m[cx][cy]="<td class='symbols "+d.difficulty+"' move='"+d.move+"'>"+P[d.move].key+"</td>";
	}
	for (j=5; j>=0; j--) {
	    str+="<tr>";
	    if (j>0&&j<5) str+="<td>"+j+"</td>"; else str+="<td></td>";
	    for (k=0; k<=7; k++) str+=m[j][k];
	    str+="</tr>\n";
	}
	return str;
    },
    canreveal: function(d) {
	return d.difficulty!="RED"||this.stress==0;
    },
    showdial: function() {
	var m=[],i,j,d;
	var gd=this.getdial();
	if (phase==PLANNING_PHASE||phase==SELECT_PHASE) {
	    for (i=0; i<=5; i++) {
		m[i]=[];
		for (j=0; j<=6; j++) m[i][j]="<td></td>";
	    }
	    var ship=$("#select"+this.id).val();
	    for (i=0; i<gd.length; i++) {
		d=gd[i];
		var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
		if (!this.canreveal(d)) m[cx][cy]="<td></td>";
		else {
		    m[cx][cy]="<td";
		    if (phase==PLANNING_PHASE) 
			m[cx][cy]+=" onclick='activeunit.setmaneuver("+i+")'";
		    m[cx][cy]+=" class='symbols maneuver "+d.difficulty;
		    if (this.maneuver==i) m[cx][cy]+=" selected";
		    m[cx][cy]+="' >"+P[d.move].key+"</td>";
		}
	    }
	    var str="";
	    for (i=5; i>=0; i--) {
		str+="<tr>";
		if (i>0&&i<5) str+="<td>"+i+"</td>"; else str+="<td></td>";
		for (j=0; j<=6; j++) str+=m[i][j];
		str+="</tr>\n";
	    }
	    if (phase==SELECT_PHASE) $("#dial"+this.id).html(str);
	    else $("#maneuverdial").html(str);
	}
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.clearmaneuver();
		return;
	    };

	}
    },
    getupgradelist:function(type) {
	var p=[];
	for (var j=0; j<UPGRADES.length; j++) {
	    var u=UPGRADES[j];
	    if (typeof u.faction != "undefined" 
		&& this.faction.match(u.faction)==null) continue;
	    if (typeof u.ship != "undefined" 
		&& this.ship.name.search(u.ship)==-1) continue;
	    if (typeof u.ishuge != "undefined") continue;
	    if (typeof u.islarge != "undefined"
		&& this.islarge!=u.islarge) continue;
	    if (typeof u.skillmin != "undefined" 
		&& this.getskill()<u.skillmin) continue;
	    if (typeof u.agilitymax != "undefined"
		&& this.getagility()>=u.agilitymax) continue;
	    if (typeof u.noupgrades != "undefined" 
		&& this.upgradetype.indexOf(u.noupgrades)>-1) continue;
	    if (typeof u.actionrequired != "undefined"
		&& this.shipactionList.indexOf(u.actionrequired.toUpperCase())==-1) continue;
	    if (typeof this.maxupg[u.type]!="undefined") {
		if (this.maxupg[u.type]<u.points) continue;
	    }
	    if (typeof u.requiredupg!="undefined") {
		var hasrequired=true;
		for (var i=0; i<u.requiredupg.length; i++) {
		    if (this.upgradetype.indexOf(u.requiredupg[i])==-1) {
			hasrequired=false;
			break;
		    }
		}
		if (!hasrequired) continue;
	    } // instead of upgradetype ?
	    if (type.match(u.type)) {
		var n=u.name;
		var n2=u.name+((u.type=="Crew")?"(Crew)":"")
		if (u.takesdouble==true && this.upgradetype.indexOf(u.type)==this.upgradetype.lastIndexOf(u.type)) continue;
		p.push(j);
	    }
	}
	p.sort(function(a,b) { return translate(UPGRADES[a].name)>translate(UPGRADES[b].name);    });
	return p;
    },
    turn: function(n) {
	this.alpha+=n;
	this.m.rotate(n,0,0); 
	this.show();
    },/* TO REMOVE */
    getactionstring: function() {
	var str="";
	for (var i=0; i<this.shipactionList.length; i++) {
	    str+="<span class='s"+this.shipactionList[i]+"'></span>";
	}
	return str;
    },
    showactionlist:function() {
	var str=this.getactionstring();
	$("#unit"+this.id+" .actionlist").html(str);
    },
    // Rolls results are deducted from probabilistic repartition...
    getattacktable: function(n) { return ATTACK[n]; },
    attackroll: function(n) {
	var i,f,h,c;
	var P=this.getattacktable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return 0;
	for (f=0; f<=n; f++) {
	    for (h=0; h<=n-f; h++) {
		for (c=0; c<=n-f-h; c++) {
		    i=f*FCH_FOCUS+h+FCH_CRIT*c;
		    ptot+=P[i];
		    if (ptot>r) return FCH_FOCUS*f+c*FCH_CRIT+h;
		}
	    }
	}
	return 0;
    },
    confirm: function(s) { return confirm(s); },
    rollattackdie: function(n,org,best) { var p=[]; for (var i=0; i<n; i++) p.push(FACE[ATTACKDICE[this.rand(8)]]); return p; },
    rolldefensedie: function(n,org,best) { var p=[]; for (var i=0; i<n; i++) p.push(FACE[DEFENSEDICE[this.rand(8)]]); return p; },
    rand: function(n) { return Math.floor(Math.random()*n); },
    getdefensetable: function(n) { return DEFENSE[n]; },
    defenseroll: function(n) {
	var i,e,f;
	var lock=$.Deferred();
	var P=this.getdefensetable(n);
	var ptot=0;
	var r=Math.random();
	if (n==0) return lock.resolve({dice:n,roll:0}).promise();
	if (typeof P=="undefined") {
	    this.error("P undefined for n="+n);
	}
	for (f=0; f<=n; f++) {
	    for (e=0; e<=n-f; e++) {
		i=f*FE_FOCUS+e*FE_EVADE;
		ptot+=P[i];
		if (ptot>r) return lock.resolve({dice:n,roll:FE_FOCUS*f+e*FE_EVADE}).promise();
	    }
	}
	return lock.resolve({dice:n,roll:0}).promise();
    },
    getdicemodifiers: function() {
	return [{from:ATTACK_M,type:MOD_M,to:ATTACK_M,org:this,
		 req:function() {return this.canusefocus();}.bind(this),
		 aiactivate: function(m,n) { return FCH_focus(m)>0; },
		 f:function(m,n) {
		     this.removefocustoken();
		     var f=FCH_focus(m);
		     if (f>0)  m=m-FCH_FOCUS*f+FCH_HIT*f;
		     return m;    
		 }.bind(this),str:"focus",token:true,noreroll:"focus"},
		{from:ATTACK_M,type:REROLL_M,to:ATTACK_M,org:this,
		 req:function(a,w,t) {return this.canusetarget(t);}.bind(this),
		 n:function() { return 9; },
		 dice:["blank","focus"],
		 f:function() {
		     activeunit.removetarget(targetunit);
		 },
		 str:"target",token:true},
		{from:DEFENSE_M,type:MOD_M,to:DEFENSE_M,org:this,
		 req:function() {return this.canusefocus();}.bind(this),
		 aiactivate:function(m,n) { 
		     mm=getattackvalue();
		     return FE_focus(m)>0&&FCH_hit(mm)+FCH_crit(mm)>FE_evade(m); 
		 },
		 f:function(m,n) {
		     this.removefocustoken();
		     var f=FE_focus(m);
		     if (f>0)  m=m-FE_FOCUS*f+FE_EVADE*f;
		     return m;    
		 }.bind(this),str:"focus",token:true},
		{from:DEFENSE_M,type:ADD_M,to:DEFENSE_M,org:this,
		 req:function() {return this.canuseevade(); }.bind(this),
		 aiactivate:function(m,n) { 
		     mm=getattackvalue();
		     return (FCH_hit(mm)+FCH_crit(mm)>FE_evade(m));
		 },
		 f: function(m,n) {	    
		     this.removeevadetoken(); 
		     return {m:m+FE_EVADE,n:n+1} 
		 }.bind(this),str:"evade",token:true,noreroll:"focus"},
	       ];
    },
    adddicemodifier: function(from,type,to,org,mod) {
	mod.org=org;
	mod.type=type;
	mod.from=from;
	mod.to=to;
	this.wrap_after("getdicemodifiers",org,function(m) {
	    return m.concat(mod);
	});
    },
    setclickhandler: function(f) {
	this.g.unmousedown();
	this.g.mousedown(f);
    },
    setdefaultclickhandler: function() {
	this.g.unmousedown();
	this.g.mousedown(function() { this.select();}.bind(this));
    },
    dragshow: function() {
	this.g.transform(this.dragMatrix);
	this.geffect.transform(this.dragMatrix);
    },
    dragmove: function(dx,dy,x,y) {
	// scaling factor
	var spl=VIEWPORT.m.split();
	var max=Math.max(900./$("#svgout").width(),900./$("#svgout").height());
	var ddx=dx*max/spl.scalex;
	var ddy=dy*max/spl.scalex;
	this.dragMatrix=MT(ddx,ddy).add(this.m);
	this.dx=ddx;
	this.dy=ddy;
	this.dragged=true;
	$(".phasepanel").hide();
	this.dragshow();
    },
    dragstart:function(x,y,a) { this.showhitsector(false); this.dragMatrix=this.m; this.dragged=false; },
    dragstop: function(a) { 
	if (this.dragged) { 
	    this.m=this.dragMatrix; this.showpanel();
	    this.tx+=this.dx; this.ty+=this.dy;
	}
	this.dragged=false;
    },
    isinzone: function(m) {
	var op=this.getOutlinePoints(m);
	var zone;
	if (this.team<=2) zone=SETUP["playzone"+this.team]; else zone=SETUP.playzone1;
	if (!Snap.path.isPointInside(zone,op[0].x,op[0].y)) return false;
	if (!Snap.path.isPointInside(zone,op[1].x,op[1].y)) return false;
	if (!Snap.path.isPointInside(zone,op[2].x,op[2].y)) return false;
	if (!Snap.path.isPointInside(zone,op[3].x,op[3].y)) return false;
	return true;
    },
    getOutlinePoints: function(m) {
	var w=(this.islarge)?40:20;
	if (typeof m=="undefined") m=this.m;
	return [{x:m.x(-w,-w),y:m.y(-w,-w)},{x:m.x(w,-w),y:m.y(w,-w)},{x:m.x(w,w),y:m.y(w,w)},{x:m.x(-w,w),y:m.y(-w,w)}];
    },
    getOutlineString: function(m) {
	var p=this.getOutlinePoints(m);
	return {s:"M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+" "+p[2].x+" "+p[2].y+" "+p[3].x+" "+p[3].y+" Z",p:p};  
    },
    getOutline: function(m) {
	var w=(this.islarge)?40:20;
	var p=s.rect(-w,-w,2*w,2*w);
	var t=s.text(w+8,3-w,"8").attr({class: "symbols",fontSize:"1.3em"});
	var g=s.g(t,p).transform(m).attr({fill:this.color,opacity:0.3,display:"none"});
	return g;
    },
    getSectorPoints: function(n,m) {
	var w=(this.islarge)?40:20;
	if (this.hasmobilearc) return this.getQuarterSectorPoints(n,m);
	var socle=Math.sqrt((w-3)*(w-3)+w*w);
	return $.map([{x:-(socle+100*n)/socle*(w-3),y:-(socle+100*n)/socle*w},
			{x:-w+3,y:-w-100*n},
			{x:w-3,y:-w-100*n},
			{x:(socle+100*n)/socle*(w-3),y:-(socle+100*n)/socle*w}],
		    function(a,i) { return transformPoint(m,a); });
    },
    getQuarterSectorPoints: function(n,m) {
	var w=(this.islarge)?40:20;
	var r=Math.sqrt(2);
	var socle=r*w;
	return $.map([{x:-(socle+100*n)/r,y:-(socle+100*n)/r},
			{x:-w,y:-w-100*n},
			{x:w,y:-w-100*n},
			{x:(socle+100*n)/r,y:-(socle+100*n)/r}],
		    function(a,i) { return transformPoint(m,a); });
    },
    getRangePoints: function(n,m) {
	var w=(this.islarge)?40:20;
	return $.map([{x:-w,y:-100*n-w},{x:w,y:-100*n-w},{x:100*n+w,y:-w},{x:100*n+w,y:w},{x:w,y:100*n+w},{x:-w,y:100*n+w},{x:-100*n-w,y:w},{x:-100*n-w,y:-w}],
		    function(a,i) { return transformPoint(m,a); });
    },
    getHalfRangePoints:function(n,m) {
	var w=(this.islarge)?40:20;
	return $.map([{x:100*n+w,y:0},{x:100*n+w,y:-w},{x:w,y:-100*n-w},{x:-w,y:-100*n-w},{x:-100*n-w,y:-w},{x:-100*n-w,y:0}],
		    function(a,i) { return transformPoint(m,a); });
    },
    getRangeString: function(n,m) {
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 1 ";
	var p=this.getRangePoints(n,m);
	return ("M "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y+circle+p[6].x+" "+p[6].y+" L "+p[7].x+" "+p[7].y+circle+p[0].x+" "+p[0].y+" Z");
    },
    getHalfRangeString: function(n,m) {
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 0 ";
	var p=this.getHalfRangePoints(n,m);
	return ("M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y+" Z");
    },
    getSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 1 ";
	var p=this.getRangePoints(n1,m);
	var str="M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y+circle+p[6].x+" "+p[6].y+" L "+p[7].x+" "+p[7].y+circle+p[0].x+" "+p[0].y;
	circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 0 ";
	p=this.getRangePoints(n2,m);
	str+=" L "+p[0].x+" "+p[0].y+circle+p[7].x+" "+p[7].y+" L "+p[6].x+" "+p[6].y+circle+p[5].x+" "+p[5].y+" L "+p[4].x+" "+p[4].y+circle+p[3].x+" "+p[3].y+" L "+p[2].x+" "+p[2].y+circle+p[1].x+" "+p[1].y+" L "+p[0].x+" "+p[0].y;
	return str;
    },
    getHalfSubRangeString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 0 ";
	var p=this.getHalfRangePoints(n1,m);
	var str="M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+circle+p[2].x+" "+p[2].y+" L "+p[3].x+" "+p[3].y+circle+p[4].x+" "+p[4].y+" L "+p[5].x+" "+p[5].y;
	var circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 1 ";
	p=this.getHalfRangePoints(n2,m);
	str+=" L "+p[5].x+" "+p[5].y+" L "+p[4].x+" "+p[4].y+circle+p[3].x+" "+p[3].y+" L "+p[2].x+" "+p[2].y+circle+p[1].x+" "+p[1].y+" L "+p[0].x+" "+p[0].y+" Z";
	return str;
    },
    getPrimarySectorString: function(n,m) {
	var w=(this.islarge)?40:20;
	var p;
	p=this.getSectorPoints(n,m); 
	var circle=" A "+(100*n)+" "+(100*n)+" 0 0 1 ";
	var o=transformPoint(m,{x:0,y:0});
	return "M "+o.x+" "+o.y+" L "+p[0].x+" "+p[0].y+circle+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+circle+p[3].x+" "+p[3].y+" Z";
    },
    getPrimarySubSectorString: function(n1,n2,m) {
	var w=(this.islarge)?40:20;
	var circle=" A "+(100*n1)+" "+(100*n1)+" 0 0 1 ";
	var p;
	p=this.getSectorPoints(n1,m); 
	var str="M "+p[0].x+" "+p[0].y+circle+p[1].x+" "+p[1].y+" L "+p[2].x+" "+p[2].y+circle+p[3].x+" "+p[3].y;
	p=this.getSectorPoints(n2,m);
	var circle=" A "+(100*n2)+" "+(100*n2)+" 0 0 0 ";
	str+="L "+p[3].x+" "+p[3].y+circle+p[2].x+" "+p[2].y+" L "+p[1].x+" "+p[1].y+circle+p[0].x+" "+p[0].y+" Z";
	return str;	
    },
    setmaneuver: function(i) {
	this.lastmaneuver=this.maneuver;
	this.maneuver=i;
	this.showdial();
	this.showmaneuver();
	if (typeof this.deferred == "undefined") this.error("undefined deferred");
	nextplanning();
	//this.deferred.notify();
    },
    select: function() {
	if (this.dead||this.isdocked) return activeunit;
	if (phase<ACTIVATION_PHASE
	    ||(phase==ACTIVATION_PHASE)
	    ||(phase==COMBAT_PHASE)) {
	    var old=activeunit;
	    activeunit=this;
	    if (old!=this) old.unselect();
	    $("#"+this.id).addClass("selected");
	    this.show();
	    center(this);
	}
	return activeunit;
    },
    unselect: function() {
	/*if (this==activeunit) return;*/
	this.showoutline();
	this.showmaneuver();
	$(".team div").removeClass("selected");
	//if (phase==SETUP_PHASE&&typeof this.g!="undefined") { this.g.undrag(); }
    },
    getmcollisions: function(m) {
	var k,i,j;
	var pathpts=[],os=[],op=[];
	var mine=[];
	// Overlapping obstacle ? 
	var so=this.getOutlineString(m);
	os=so.s;
	op=so.p;
	for (k=0; k<OBSTACLES.length; k++){
	    if (OBSTACLES[k].type==NONE) continue;
	    var ob=OBSTACLES[k].getOutlineString();
	    if (OBSTACLES[k].type==BOMB
		&&(Snap.path.intersection(ob.s,os).length>0 
		||this.isPointInside(ob.s,op)
		||this.isPointInside(os,ob.p))) {
		mine.push(k);
		break;
	    }
	}
	return mine;
    },
    getBall: function(m) {
	return { x:m.x(0,0),y:m.y(0,0),diam:(this.islarge?56:28) };
    },
    /* TODO: remove from unit? */
    guessevades: function(roll,lock) {
	var resolve=function(k) {
	    if (k==FE_evade(roll.roll)) {
		this.log("guessed correctly ! +1 %EVADE% [%0]",self.name);
		roll.roll+=FE_EVADE;
		roll.dice+=1;
	    }
	    $("#actiondial").empty();
	    lock.resolve(roll);
	}.bind(this);

	this.log("guess the number of evades out of %0 dice [%1]",roll.dice,self.name);
	$("#actiondial").empty();
	for (var i=0; i<=roll.dice; i++) {
	    (function(k) {
		var e=$("<button>").html(k+" <code class='xevadetoken'></code>")
		    .on("touch click",function() { resolve(k);}.bind(this));
		$("#actiondial").append(e);
	    }.bind(this))(i);
	}
    },
    guessmove: function(t) {
	var resolve = function(k) {
	    if (k==t) console.log(">> guess correctly!");
	}
	var gd=t.getdial();
	for (var i in gd) {
	    (function(k) {
		var speed=d.move.substr(-1);
		var e=$("<button>").html("<span class='symbols maneuver>"+P[d.move].key+"</span>"+speed)		    
		    .on("touch click",function() { resolve(k);}.bind(this));
		$("#actiondial").append(e);

	    }.bind(this))(i);
	}
    },
    fastgetocollisions: function(mbegin,mend,path,len) {
	var k,i;
	// Overlapping obstacle ?
	var pp=[];
	var tb=this.getBall(mend);
	if (typeof path=="undefined") {
	    var minv=mbegin.invert();
	    var x1=0;
	    var y1=0;
	    var x2=mend.x(0,0);
	    var y2=mend.y(0,0);
	    var x3=minv.x(x2,y2);
	    var y3=minv.y(x2,y2);
	    path=s.path("M "+x1+" "+y1+" L "+x3+" "+y3).appendTo(VIEWPORT).attr({display:"none"});
	    len=path.getTotalLength();
	    if (len==0) return false;
	}
	for (i=0,k=0; i<=len; i+=len/5,k++) {
	    var p=path.getPointAtLength(i);
	    pp[k]={x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)};
	}
	//for (i=0; i<pp.length; i++) 
	//    s.circle(pp[i].x,pp[i].y,2).attr({fill:"#fff"});
	//s.circle(tb.x,tb.y,tb.diam).attr({fill:"#f00"});
	for (k=0; k<OBSTACLES.length; k++){
	    if (OBSTACLES[k].type==BOMB) continue;
	    if (OBSTACLES[k].type==NONE) continue;
	    var b=OBSTACLES[k].getBall();
	    var D=b.diam+tb.diam;
	    //s.circle(b.x,b.y,b.diam).attr({fill:"#fff"});
	    var d=D*D;
	    if ((b.x-tb.x)*(b.x-tb.x)+(b.y-tb.y)*(b.y-tb.y)<d) return true;
	    for (i=0; i<pp.length; i++) 
	 	if ((b.x-pp[i].x)*(b.x-pp[i].x)+(b.y-pp[i].y)*(b.y-pp[i].y)<d) return true;
	}
	return false;
    },
    getocollisions: function(mbegin,mend,path,len) {
	var k,i,j;
	var pathpts=[],os=[],op=[];
	var collision={overlap:-1,template:[],mine:[]};
	// Overlapping obstacle ? 
	var so=this.getOutlineString(mend);
	os=so.s;
	op=so.p;
	for (k=0; k<OBSTACLES.length; k++){
	    var o=OBSTACLES[k];
	    if (o.type==NONE) continue;
	    var ob=o.getOutlineString();
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.isPointInside(ob.s,op)
		||this.isPointInside(os,ob.p)) {
		if (this.oldoverlap!=k) {
		    if (o.type!=BOMB) collision.overlap=k; 
		    else collision.mine.push(o);
		} 
	    }
	}
	if (typeof path!="undefined") {
	    // Template overlaps ? 
	    for (i=0,k=0; i<=len; i+=5,k++) {
		var p=path.getPointAtLength(i);
		pathpts[k]={x:mbegin.x(p.x,p.y),y:mbegin.y(p.x,p.y)};
	    }
	    for (j=0; j<pathpts.length; j++) {
		for (k=0; k<OBSTACLES.length; k++) {
		    var o=OBSTACLES[k];
		    if (o.type==NONE) continue;
		    if (k!=collision.overlap&&k!=this.oldoverlap&&collision.template.indexOf(k)==-1&&collision.mine.indexOf(o)==-1) { // Do not count overlapped obstacle twice
			var o2=o.getOutlineString().p;
			for(i=0; i<o2.length; i++) {
			    var dx=(o2[i].x-pathpts[j].x);
			    var dy=(o2[i].y-pathpts[j].y);
			    if (dx*dx+dy*dy<=100) { 
				if (o.type!=BOMB) collision.template.push(k); 
				else collision.mine.push(OBSTACLES[k]);
				break;
			    } 
			}
		    }
		}
	    }
	}	   
	return collision;
    },
    iscollidingunit: function(m,sh) {
	var o1=this.getOutlineString(m).s;
	var o2=sh.getOutlineString(sh.m).s; 
	var inter=Snap.path.intersection(o1, o2);
	var collision=(inter.length>0);
	// If unit is large, add another check
	if (this.islarge) { collision=collision||this.isinoutline(o1,sh,sh.m); }
	if (sh.islarge)  { collision = collision||sh.isinoutline(o2,this,m); }
	return collision;
    },
    getcollidingunits: function(m) {
	var i;
	var c=[];
	for (i in squadron) {
	    var sh=squadron[i];
	    if (sh!=this)
		if (this.iscollidingunit(m,sh)) c.push(sh);
	};
	return c;
    },
    getpathmatrix: function(m,maneuver,halfturn) {
	if (typeof P[maneuver]=="undefined") {
	    console.log("***Undefined maneuver "+maneuver);
	}
	var path=P[maneuver].path;
	var len=path.getTotalLength();
	if (this.islarge) len+=40;
	var m0=m.clone();
	if (maneuver.match(/RF1|RR1|RL1/)) m0=m0.rotate(180,0,0);
	var mm=this.getmatrixwithmove(m0, path, len);
	if (maneuver.match(/K\d|SR\d|SL\d/)||halfturn==true) mm.rotate(180,0,0);
	if (maneuver.match(/TRL\d/)) mm.rotate(-90,0,0);
	if (maneuver.match(/TRR\d/)) mm.rotate(90,0,0);
	if (maneuver.match(/RF1|RR1|RL1/)) mm.rotate(180,0,0);
	path.remove();
	return mm;
    },
    /* TODO: should prevent collision with obstacles if collision with
     * unit shortens path */
    getmovecolor: function(m,withcollisions,withobstacles,path,len,order) {
	var i,k;
	var col=false;
	if (!this.isinzone(m)) return RED;
	if (withobstacles) {	    
	    var c=this.ocollision;
	    this.ocollision=this.getocollisions(this.m,m,path,len);
	    if (this.hascollidedobstacle()) col=true;
	    this.ocollision=c;
	}
	if (col) return YELLOW;
 	if (withcollisions) {
	    var so=this.getOutlineString(m);
	    var sk=this.getskill();
	    for (k in squadron) {
		var u=squadron[k];
		if (u==this) continue;
		var m=(order?u.futurem:u.m);
		var su=u.getOutlineString(m);
		if (Snap.path.intersection(su.s,so.s).length>0
		    ||((this.islarge&&!u.islarge&&this.isPointInside(so.s,su.p)))
		    ||((!this.islarge&&u.islarge)&&this.isPointInside(su.s,so.p))) return WHITE;
	    }
	}
	return GREEN;
    },
    isTurret: function(w) {
	return (w.type=="Turretlaser");
    },
    candoactivation:function() {
	return this.maneuver!=-1;
    },
    candoroll:function() {
	var moves=this.getrollmatrix(this.m);
	var b=false;
	var ob=this.canmoveonobstacles("ROLL");
	for (var i=0; i<moves.length; i++) {
	    var c=this.getmovecolor(moves[i],true,true);
	    b=b||(c==GREEN)||(c==YELLOW&&ob);
	}
	return b;
    },
    candoboost:function() {
	var moves=this.getboostmatrix(this.m);
	var b=false;
	var ob=this.canmoveonobstacles("BOOST");
	for (var i=0; i<moves.length; i++) {
	    var c=this.getmovecolor(moves[i],true,true);
	    b=b||(c==GREEN)||(c==YELLOW&&ob);
	}
	return b;
    },
    candocoordinate: function() { return this.selectnearbyally(2).length>0; },
    newaction:function(a,str) {
	return {action:a,org:this,type:str,name:str};
    },
    getactionbarlist: function(isendmaneuver) {
	var i,al=[];
	var ftrue=(() => true);
	for (i=0; i<this.shipactionList.length; i++) {
	    var a=this.shipactionList[i];
	    /* TODO actionsdone */
	    if (!this.isactiondone(a)) {
		switch(a) {
		    case "CLOAK": if (this.candocloak()) 
			al.push(this.newaction(this.addcloak,"CLOAK")); break;
		    case "FOCUS": 
		    if (this.candofocus()) 
			al.push(this.newaction(this.addfocus,"FOCUS")); break;
		    case "EVADE": if (this.candoevade()) 
			al.push(this.newaction(this.addevade,"EVADE")); break;
		    case "TARGET":if (this.candotarget()) 
			al.push(this.newaction(this.resolvetarget,"TARGET"));break;
		    case "ARCROTATE": if (this.candoarcrotate())
			al.push(this.newaction(this.resolvearcrotate,"ARCROTATE")); break;
		    case "BOOST":if (this.candoboost())
			al.push(this.newaction(this.resolveboost,"BOOST"));break;
		    case "ROLL":if (this.candoroll()) 
			al.push(this.newaction(this.resolveroll,"ROLL"));break;
		    case "SLAM":if (isendmaneuver) al.push(this.newaction(this.resolveslam,"SLAM"));break;
		    case "COORDINATE": if (this.candocoordinate()) 
		    al.push(this.newaction(this.resolvecoordinate,"COORDINATE"));break;
		}
	    }
	}
	return al;
    },
    getupgactionlist: function() {
	var i,al=[];
	for (i=0; i<this.upgrades.length; i++) {
	    var upg=this.upgrades[i];
	    if ((!this.isactiondone(upg.name))
		&&upg.isactive&&typeof upg.action=="function"&&upg.candoaction()) 
		al.push({org:upg,action:upg.action,type:upg.type.toUpperCase(),name:upg.name});
	    if ((!this.isactiondone(upg.name+"/2"))
		&&upg.isactive&&typeof upg.action2=="function"&&upg.candoaction2()) 
		al.push({org:upg,action:upg.action2,type:upg.type.toUpperCase(),name:upg.name+"/2"});
	    
	}
	return al;
    },
    getcritactionlist: function() {
	var i,al=[];
	for (i=0; i<this.criticals.length; i++) {
	    var crit=this.criticals[i];
	    if ((!this.isactiondone(crit.name))
		&&crit.isactive&&typeof crit.action=="function") {
		crit.type="CRITICAL"; crit.org=crit;
		al.push(crit);
	    }
	}
	return al;
    },
    getactionlist: function(isendmaneuver) {
	var sal=this.getactionbarlist(isendmaneuver);
	var ual=this.getupgactionlist();
	var cal=this.getcritactionlist();
	return sal.concat(ual).concat(cal);
    },
    addevadetoken: function() {
	this.evade++;
	this.animateaddtoken("xevadetoken");
	this.movelog("E");
	this.show();
    },
    addevade: function(n) { 
	this.addevadetoken(); 
	this.endaction(n,"EVADE");
    },
    addfocustoken: function() {
	this.focus++;
	this.animateaddtoken("xfocustoken");
	this.movelog("FO");
	this.show();
    },
    addtractorbeam:function(u) {
	this.addtractorbeamtoken();
	if (this.tractorbeam==1&&!this.islarge) {
	    var oldm=this.m;
	    p=Unit.prototype.getrollmatrix.call(this,this.m).concat(this.getpathmatrix(this.m,"F1"));
	    u.doselection(function(n) {
		u.resolveactionmove.call(
		    this,p,
		    function (t,k) { t.ocollision=t.getocollisions(oldm,p[k]); t.endnoaction(n,"BOOST"); },true,true);
	    }.bind(this));
	}
    },
    addtractorbeamtoken: function() {
	this.tractorbeam++;
	this.animateaddtoken("xtractorbeamtoken");
	this.movelog("TB");
	this.show();
    },
    removetractorbeamtoken: function() {
	this.tractorbeam--;
	this.animateremovetoken("xtractorbeamtoken");
	this.movelog("tb");
	this.show();
    },
    addfocus: function(n) { 
	this.addfocustoken(); 
	this.endaction(n,"FOCUS");
    },
    addstress: function() {
	this.stress++;
	this.animateaddtoken("xstresstoken");
	this.movelog("ST");
	this.show();
    },
    addiontoken: function() {
	this.ionized++;
	this.animateaddtoken("xionizedtoken");
	this.movelog("I");
	this.show();
    },
    removeiontoken: function() {
	this.ionized--;
	this.animateremovetoken("xionizedtoken");
	this.movelog("i");
	this.show();
   },
    warndeath: function(c,h,t) {
    },
    dies: function() {
	this.movelog("d-0");
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("dead");
	$("#"+this.id).html(""+this);
	$("#"+this.id+" .outoverflow").each(function(index) { 
	    if ($(this).css("top")!="auto") {
		$(this).css("top",$(this).parent().offset().top+"px");
	    }
	});
	i=squadron.indexOf(this);
	for (i in squadron) {
	    if (squadron[i]==this) {
		delete squadron[i];
	    } else if (squadron[i].team==this.team) {
		squadron[i].warndeath(this.hull,this.shield,this);
	    }
	}
	filltabskill();
	/* Remove targets of dead unit */
	for (i=0; i<this.targeting.length; i++) {
	    var t=this.targeting[i];
	    n=t.istargeted.indexOf(this);
	    if (n>-1) t.istargeted.splice(n,1);
	    t.show();
	}
	/* Remove locks on dead unit */
	for (i=0; i<this.istargeted.length; i++) {
	    var t=this.istargeted[i];
	    n=t.targeting.indexOf(this);
	    if (n>-1) t.targeting.splice(n,1);
	    t.show();
	}
	this.targeting=[];
	this.g.attr({display:"none"});
	this.imgsmoke.attr("display","none");
	this.imgflame.attr("display","none");
	if (this.islarge) this.imgexplosion= s.image("png/explosion3.gif",-80,-80,160,160);
	else this.imgexplosion= s.image("png/explosion3.gif#"+Math.random(),-40,-40,80,80);
	this.geffect.add(this.imgexplosion);
	this.show();
	if (!FAST) SOUNDS.explode.play();
	this.dead=true;
	
	if (this==this.captain) this.electcaptain();
	this.log("has exploded!");
	setTimeout(function(){ 
	    //this.m=MT(-60,-60);
	    this.geffect.attr({display:"none"});
	    this.show();
	    if (TEAMS[this.team].checkdead()) win(this.team);	
	    //squadron[0].select();
	}.bind(this), (FAST?0:1000)); // 29 images * 4 1/100th s
    },
    canbedestroyed: function() {
	if (skillturn!=this.getskill()) return true;
	return false;
    },
    checkdead: function() {
	if (!this.dead&&(this.hull<=0||!this.isinzone(this.m))) {
	    this.dies();
	    var r=TEAMS[this.team].history.rawdata;
	    if (typeof r[round]=="undefined") r[round]={hits:0,dead:""};
	    r[round].dead+=this.name+" ";
	    return true;
	}	
	return false;
    },
    // TODO: should be only for defense dice, not evades
    cancelhit:function(r,sh){
	var h=FCH_hit(r.ch);
	if (h>=r.e) return {ch:r.ch-r.e*FCH_HIT,e:0}; 
	else return {ch:r.ch-h*FCH_HIT, e:r.e-h};
    }, 
    cancelcritical:function(r,sh) {
	var c=FCH_crit(r.ch);
	if (c>=r.e) return {ch:r.ch-r.e*FCH_CRIT,e:0}; 
	else return {ch:r.ch-c*FCH_CRIT, e:r.e-c};
    },
    evadeattack: function(sh) {
	var e=getdefenseresult();
	var ch=getattackresult();
	displayattackroll(getattackdice(),ch);
	var r=this.cancelhit({ch:ch,e:e},sh);
	r=this.cancelcritical(r,sh);
	if (typeof r=="undefined") this.error("undefined cancel critical");
	return r.ch;
    },
    declareattack:function(w,target) {
	targetunit=target;
	this.activeweapon=w;
	if (this.weapons[w].declareattack(target)) {
	    this.log("attacks %0 with %1",target.name,this.weapons[w].name);
	    target.isattackedby(w,this);
	    return true;
	} else this.log("cannot attack %0 [%1]",target.name,this.weapons[w].name); 	    
	return false;
    },
    isattackedby:function(k,a) {},
    endmodifydefensestep: function() {},
    endmodifyattackstep: function() {},
    /* TODO: remove, unused */
    modifydamageassigned: function(ch,attacker) {return ch;},
    modifydefenseroll: function(a,m,n) { return m;},
    modifyattackroll: function(m,n,d) { return m;},
    resolveishit:function() {},
    hashit:function(t) { return this.criticalresolved+this.hitresolved>0;},
    resolvedamage: function() {
	$(".fireline").remove();
	if (!FAST) this.playfiresnd();
	var ch=targetunit.evadeattack(this);
	ch=this.weapons[this.activeweapon].modifydamageassigned(ch,targetunit);
	ch=targetunit.modifydamageassigned(ch,this);
	TEAMS[this.team].allred+=getattackdice();
	TEAMS[targetunit.team].allgreen+=getdefensedice();
	TEAMS[this.team].allhits+=FCH_hit(ch);
	TEAMS[this.team].allcrits+=FCH_crit(ch);
	TEAMS[targetunit.team].allevade+=FE_evade(getdefenseresult());
	var c=FCH_crit(ch);
	var h=FCH_hit(ch);
	this.hasdamaged=true;
	this.hitresolved=h;
	this.criticalresolved=c;
	if (this.hashit(targetunit)) {
	    targetunit.resolveishit(this);
	    this.weapons[this.activeweapon].prehit(targetunit,c,h);
	    if (this.hitresolved+this.criticalresolved<targetunit.shield) 
		targetunit.log("-%0 %SHIELD%",(this.criticalresolved+this.hitresolved));
	    else if (targetunit.shield>0) targetunit.log("-%0 %SHIELD%",targetunit.shield);
	    this.hitresolved=targetunit.resolvehit(this.hitresolved);
	    this.criticalresolved=targetunit.resolvecritical(this.criticalresolved);
	    this.weapons[this.activeweapon].posthit(targetunit,c,h);
	} 
	this.weapons[this.activeweapon].endattack(c,h);
	this.usedweapon=this.activeweapon;
	if (!this.weapons[this.activeweapon].hasdoubleattack()) {
	    if (TEAMS[targetunit.team].initiative) {
		targetunit.afterdefenseeffect(c,h,this);
		barrier(function() { 
		    this.afterattackeffect(c,h);
		    if (targetunit.canbedestroyed(skillturn)) {
			targetunit.checkdead();
		    }
		    targetunit.endbeingattacked(c,h,this);
		    this.endattack(c,h,targetunit);
		    this.cleanupattack();
		}.bind(this));
	    } else {
		this.afterattackeffect(c,h);
		barrier(function() {
		    targetunit.afterdefenseeffect(c,h,this);
		    if (targetunit.canbedestroyed(skillturn)) {
			targetunit.checkdead();
		    }
		    this.endattack(c,h,targetunit);
		    targetunit.endbeingattacked(c,h,this);
		    this.cleanupattack();
		}.bind(this));
	    } 
	} else {
	    // Twin attack, same target, same weapon
	    this.latedeferred=this.deferred;
	    if (targetunit.canbedestroyed(skillturn)) targetunit.checkdead();
	    if (!targetunit.dead) {
		this.newlock().done(function() {
		    this.deferred=this.latedeferred;
		    this.log("+1 attack with %0",this.weapons[this.activeweapon].name);
		    this.resolveattack(this.activeweapon,targetunit); 
		}.bind(this));
	    }
	    this.cleanupattack();
	}
    },
    afterattackeffect:function(c,h) {},
    afterdefenseeffect:function(c,h) {},
    postattack: function(i) { },
    cleanupattack: function() {
	this.actionbarrier();
	ENGAGED=false;
    },
    resetfocus: function() {
	return 0;
    },
    resetevade: function() {
	return 0;
    },
    resettractorbeam: function() {
	return 0;
    },   
    endround: function() {
	for (var i=0; i<this.upgrades.length; i++) 
	    this.upgrades[i].endround();
	this.focus=this.resetfocus();
	this.evade=this.resetevade();
	this.hasfired=0;
	this.maxfired=1;
	this.tractorbeam=this.resettractorbeam();
	this.oldoverlap=this.ocollision.overlap;
	this.ocollision.overlap=-1;
	this.ocollision.template=[];
	this.ocollision.mine=[];
	this.collision=false;
	this.touching=[];
	this.showinfo();
    },
    playfiresnd: function() {
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	var p=s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2)).appendTo(VIEWPORT).attr({stroke:this.color,strokeWidth:2});
	var process=setInterval(function() { p.remove(); clearInterval(process);
	},200);
	this.movelog("f-"+targetunit.id+"-"+this.activeweapon);
	if (typeof this.weapons[this.activeweapon]!="undefined" && typeof this.weapons[this.activeweapon].firesnd!="undefined") 
	    SOUNDS[this.weapons[this.activeweapon].firesnd].play();
	else SOUNDS[this.ship.firesnd].play();		
    },
    endattack: function(c,h,t) {
	for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
	this.show();
    },
    endbeingattacked:function(c,h,t) {},
    showpositions:function(gd) {
	var i;
	var o=[];
	this.evaluatemoves(true,true);
	for (i=0; i<gd.length; i++) 
	{
	    var mm=gd[i].m;
	    o[i]=this.getOutline(mm).attr({title:gd[i].move,opacity:0.4,fill:halftone(gd[i].color),display:"block",class:'possible'}).appendTo(VIEWPORT);
	    (function(i) {o[i].hover(function() { o[i].attr({stroke:gd[i].color,strokeWidth:4})}.bind(this),
				     function() { o[i].attr({strokeWidth:0})}.bind(this)); }.bind(this))(i);
	}	
    },
    showmeanposition: function() {
	var gd=this.getdial();
	var o;
	this.evaluatemoves(true,true);
	this.showpositions([{color:GREEN,move:"mean",m:this.meanm}]);
    },
    shownextpositions: function() {
	var gd=this.getdial();
	var o;
	this.evaluatemoves(true,true);
	var n=[];
	for (i=0; i<gd.length; i++) n[i]=gd[i].next;
	this.showpositions(n);
    },
    showpossiblepositions:function() {
	this.evaluatemoves(true,true);
	var gd=this.getdial();
	this.showpositions(gd);
    },
    electcaptain: function() {
	var captain=this;
	var i,j,n;
	var squad=[];
	var p=this.selectnearbyunits(3,(a,b) => a.team==b.team&&!a.dead&&!a.isdocked&&!a.islarge);
	for (i in p) {
	    var b=p[i];
	    squad.push(b);
	    if (b.skill>captain.skill
		||(b.skill==captain.skill&&b.id<captain.id)) captain=b;
	};
	console.log("CAPTAIN ELECTED:"+captain.name);
	TEAMS[this.team].captain=captain;
	captain.squad=squad;
	for (i in squad) {
	    squad[i].captain=captain;
	    squad[i].squad=squad;
	}
	squad.sort(function(a,b) {
	    var i;
	    for (i=1; i<=3; i++) {
		if (a.isinsector(a.m,i,b,this.getHalfSubRangeString,this.getHalfRangeString)) return -1;
		if (b.isinsector(b.m,i,a,this.getHalfSubRangeString,this.getHalfRangeString)) return 1;
	    }
	    for (i=1; i<=3; i++) {
		if (a.isinsector(a.m.clone().rotate(90,0,0),i,b,this.getHalfSubRangeString,this.getHalfRangeString)) return -1;
		if (b.isinsector(b.m.clone().rotate(90,0,0),i,a,this.getHalfSubRangeString,this.getHalfRangeString)) return 1;
	    }
	    return 0;
	}.bind(this));

	u=squad[0];
	for (i=1; i<squad.length; i++) {
	    var isin=false;
	    isin|= squad[i].isinsector(squad[i].m,1,u,this.getHalfSubRangeString,this.getHalfRangeString);
	    isin|= squad[i].isinsector(squad[i].m,2,u,this.getHalfSubRangeString,this.getHalfRangeString);
	    if (!isin) break;
	
	}
	/*for (j=0; j<i; j++) {
	    console.log("last row: "+squad[j].name);
	}*/
	captain.firstrow=i;
	var gdall=[];
	captain.captaingd=[];
	n=squad.length;
	for (j=0; j<squad.length; j++) {
	    var dial=squad[j].getdial();
	    for (i=0; i<dial.length; i++) {
		if(typeof gdall[dial[i].move]=="undefined") gdall[dial[i].move]=[];
		gdall[dial[i].move].push(i);
	    }
	}
	j=0;
	var bank=0;
	var sharp=0;
	for (i in gdall) {
	    if (gdall[i].length==n) {
		if (i=="BL1") bank++;
		if (i=="BL2") bank+=2;
		if (i=="BL3") bank+=3;
		if (i=="TL1") sharp++;
		if (i=="TL3") sharp+=3;
		captain.captaingd[j++]={move:i,
				   idx:gdall[i],
				   color:GREEN};
	    } 
	}
	/*if (bank==6) { console.log("sharp turn"); }*/
    },
    showgrouppositions: function() {
	if (typeof this.captain=="undefined") this.electcaptain();
	this.captain.evaluategroupmoves();
	this.showpositions(this.captain.captaingd);
    },

    evaluateposition: function() {
	var enemies=0;
	var attackenemy=0;
	var attack=0;
	var n=0;
	var i,j;
	var dist=0;
	var na=0;
	NOLOG=true;
	for (j in squadron) {
	    var u=squadron[j];
	    if (this.isenemy(u)) {
		var a=0;/* TODO: no defense */
		for (i=0; i<u.weapons.length; i++) { 
		    var x=u.weapons[i].getrange(this);
		    if (x>0&&x<4) a=Math.max(a,u.getattackstrength(i,this));
		}
		attackenemy+=a;
		for (i=0; i<this.weapons.length; i++) {
		    var y=this.weapons[i].getrange(u);
		    if (y>0&&y<4) attack=Math.max(attack,this.getattackstrength(i,u));
		}
		dist+=Math.sqrt(this.getdist(this.m,u)/10000);
		//console.log(">> "+Math.sqrt(this.getdist(this.m,u)/10000));
		n++;
		if (a>0) na++;
	    }
	}
	NOLOG=false;
	//console.log(this.name+"  >"+attack+" "+attackenemy+" "+(dist/n)+" "+na);
	return {self:attack,enemy:attackenemy,dist:dist/n} ;
    },
    evaluategroupmoves: function() {
	var gdall=[];
	var COLOR=[GREEN,WHITE,YELLOW,RED,BLACK];
	var DIFFICULTY=["GREEN","WHITE","RED"];
	var i,j,d,k,c,color;
	var gd=this.captaingd;
	var mx=0,my=0,ma=0;
	var g=0,u;
	var best=RED;
	var VALUES={"#000":0,"#F00":1,"#FF0":2,"#FFF":3,"#0F0":4};
	var N=this.squad.length;
	for (i=0;i<N; i++) {
	    this.squad[i].evaluatemoves(true,true);
	}
	for (j=0; j<gd.length; j++) 
	    gd[j].m=this.getpathmatrix(this.m,gd[j].move);
	for (i=0;i<gd.length; i++) {
	    d=gd[i].idx;
	    color=0;
	    var dd=0;
	    for (j=0; j<d.length; j++) {
		c=this.squad[j].getdial()[d[j]].color;
		var diff=this.squad[j].getdial()[d[j]].difficulty;
		if (COLOR.indexOf(c)>color) color=COLOR.indexOf(c);
		if (DIFFICULTY.indexOf(diff)>dd) dd=DIFFICULTY.indexOf(diff);
	    }
	    gd[i].color=COLOR[color];
	    gd[i].difficulty=DIFFICULTY[dd];
	}

	NOLOG=true;

	for (i=0; i<gd.length; i++) {
	    gd[i].path=P[gd[i].move].path;
	    gd[i].len=gd[i].path.getTotalLength()+(this.islarge?40:0);
	}
	for (i=0; i<gd.length; i++) {
	    var mm =[];
	    var gdi=gd[i];
	    gdi.color=GREEN;
	    for (k=0; k<N; k++) {
		u=this.squad[k];
		mm[k]= u.getpathmatrix(u.m,gdi.move);
		if (!u.canreveal(gdi)) { gdi.color=BLACK; break; }
	    }
	    if (gdi.color==BLACK) continue;
	    for (k=0; k<N; k++) {
		u=this.squad[k];
		color=u.getmovecolor(mm[k],true,true,gdi.path,gdi.len,true);
		if (VALUES[gdi.color]>VALUES[color]) gdi.color=color;
	    }
	    if (gdi.color==RED||gdi.color==BLACK) continue;
	    c=RED;
	    for (j=0; j<gd.length; j++) {
		var ccc;
		if (gd[j].move=="F0"||(gd[j].difficulty=="RED"&&gd[i].difficulty=="RED")) continue;
		// Simplification: no need to uturn here.
		var mmm=[];
		for (k=0; k<N; k++) mmm[k]=this.squad[k].getmatrixwithmove(mm[k],gd[j].path,gd[j].len);
		for (k=0; k<N; k++) if (!this.squad[k].isinzone(mmm[k])) break;
		if (k<N) continue;
		ccc=GREEN;
		for (k=0; k<N; k++) if (this.squad[k].fastgetocollisions(mm[k],mmm[k],gd[j].path,gd[j].len)) {ccc=YELLOW; break; }
		if (VALUES[ccc]>VALUES[c]) c=ccc;
		if (c==GREEN) break;
	    }
	    if (VALUES[c]<VALUES[gdi.color]) gdi.color=c;
	}
    },
    evaluatemoves: function(withcollisions,withobstacles) {
	this.meanmround=round;
	var gd=this.getdial();
	var mx=0,my=0,ma=0;
	var g=0;
	var i,best=RED;
	var VALUES={"#000":0,"#F00":1,"#FF0":2,"#FFF":3,"#0F0":4};
	NOLOG=true;
	var ref=(this.m.split().rotate+360+180)%360-180;

	for (i=0; i<gd.length; i++) {
	    gd[i].path=P[gd[i].move].path;
	    gd[i].len=gd[i].path.getTotalLength()+(this.islarge?40:0);
	}
	var m=this.m;
	for (i=0; i<gd.length; i++) {
	    var mm = this.getpathmatrix(this.m,gd[i].move);
	    gd[i].m=mm;
	    if (!this.canreveal(gd[i])) gd[i].color=BLACK; 
	    else {
		var color=this.getmovecolor(mm,withcollisions,withobstacles,gd[i].path,gd[i].len,true);
		gd[i].color=color;
		
		if (color!=RED&&color!=BLACK&&withcollisions&&withobstacles) {
		    var c=RED;
		    var ocol=this.ocollision;
		    for (var j=0; j<gd.length; j++) {
			var ccc;
			if (gd[j].move=="F0"||
			    (gd[j].difficulty=="RED"&&
			    ((!this.hasnostresseffect()&&gd[i].difficulty!="GREEN")
			     ||gd[i].difficulty=="RED"))) continue;
			// Simplification: no need to uturn here.
			var mmm=this.getmatrixwithmove(mm,gd[j].path,gd[j].len);
			ccc=GREEN;
			if (!this.isinzone(mmm)) ccc=RED;
			else if (withobstacles) {
			    if (this.fastgetocollisions(mm,mmm,gd[j].path,gd[j].len)) this.ocollision.overlap=1;
			    else this.ocollision.overlap=-1;
			    if (this.hascollidedobstacle()) ccc=YELLOW;
			}
			if (VALUES[ccc]>VALUES[c]) c=ccc;
		    }
		    this.ocollision=ocol;
		    if (VALUES[c]<VALUES[color]) gd[i].color=c;
		}
		//this.log(">"+gd[i].move+" "+gd[i].color+" "+withobstacles);
	    }
	    if (VALUES[best]>VALUES[gd[i].color]) best=gd[i].color;
	    if ((gd[i].color==GREEN||gd[i].color==WHITE)&&!gd[i].move.match(/K\d|SR\d|SL\d|TRL\d|TRR\d/)) {
		var gpm=mm.split();
		g++;
		gpm.rotate=(gpm.rotate-ref+180)%360-180;
		mx+=gpm.dx; my+=gpm.dy; ma+=gpm.rotate;
	    }
	}
	for (i=0; i<gd.length; i++) {
	    if (gd[i].move=="F0") gd[i].color=best;
	}
	if (g==0) g=1;
	mx=mx/g; my=my/g; ma=ma/g;
	this.meanm= (new Snap.Matrix()).translate(mx,my).rotate(ma+ref,0,0);
	NOLOG=false;
    },
    removetarget: function(t) {
	var n;
	n=t.istargeted.indexOf(this);
	if (n>-1) t.istargeted.splice(n,1);
	n=this.targeting.indexOf(t);
	if (n>-1) { 
	    this.targeting.splice(n,1);
	    this.movelog("t-"+t.id);
	    t.show();
	    this.show();
	}
	if (this.targeting.length==0) $("#atokens > .xtargettoken").remove();
    },
    removeevadetoken: function() { this.animateremovetoken("xevadetoken"); this.evade--; this.movelog("e"); this.show();},
    removefocustoken: function() { this.animateremovetoken("xfocustoken"); this.focus--; this.movelog("fo"); this.show();},
    resolveactionmove: function(moves,cleanup,automove,possible) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<this.pos.length; i++) this.pos[i].ol.remove();
	    if (automove) {
		var gpm=m.split();
		var tpm=this.m.split();
		s.path("M "+tpm.dx+" "+tpm.dy+" L "+gpm.dx+" "+gpm.dy).attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",strokeLinecap:"round",strokeDasharray:"1, 30",opacity:0.2,fill:"rgba(0,0,0,0)"}).addClass("trace").appendTo(VIEWPORT);
		this.m=m;
	    }
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    var o=OBSTACLES[mine[i]];
		    if (o.type==BOMB&&typeof o.detonate=="function") 
			o.detonate(this,false)
		    else {
			this.ocollision.overlap=i;
			this.log("colliding with obstacle");
			if (!possible) this.resolveocollision(1,[]);
		    }
		}
	    if (automove) {
		var gpm=m.split();
		this.movelog("am-"+Math.floor(300+gpm.dx)+"-"+Math.floor(300+gpm.dy)+"-"+Math.floor((360+Math.floor(gpm.rotate))%360));
	    }
	    f(this,k);
	    this.show();
	}.bind(this);
	for (i=moves.length-1; i>=0; i--) {
	    var c=this.getmovecolor(moves[i],true,true);
	    if ((possible&&(c==YELLOW||c==RED))||c==GREEN||(possible&&!automove)) {
		p=this.getOutline(moves[i]).attr({display:"block"}).appendTo(VIEWPORT);
		this.pos.push({ol:p,k:i});
	    }
	}
	if (this.pos.length>0) {
	    if (this.pos.length==1) {
		resolve(moves[this.pos[0].k],this.pos[0].k,cleanup);
	    } else for (i=0; i<this.pos.length; i++) {
		(function(i) {
		var p=this.pos[i];
		p.ol.hover(function() { this.pos[i].ol.attr({stroke:this.color,strokeWidth:4})}.bind(this),
			   function() { this.pos[i].ol.attr({strokeWidth:0})}.bind(this));
		    p.ol.click(function() { resolve(moves[this.pos[i].k],this.pos[i].k,cleanup); }.bind(this));
		    p.ol.touchend(function() { resolve(moves[this.pos[i].k],this.pos[i].k,cleanup); }.bind(this));
		    }.bind(this))(i);
	    }
	} else resolve(this.m,-1,cleanup);
    },
    resolveactionselection: function(units,cleanup) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(k) {
	    for (i=0; i<units.length; i++) {
		units[i].outline.removeClass("outline");
		units[i].outline.attr({fill:"rgba(8,8,8,0.5)"});
		units[i].setdefaultclickhandler();
	    }
	    cleanup(k);
	}.bind(this);
	if (units.length==0) resolve(-1);
	else if (units.length==1) resolve(0);
	else for (i=0; i<units.length; i++) {
	    units[i].outline.attr({fill:"rgba(100,100,100,0.8)"});
	    units[i].outline.addClass("outline");
	    (function(k) { units[k].setclickhandler(function() { resolve(k);}); })(i);
	}
    },
    getboostmatrix:function(m) {
	return [this.getpathmatrix(m,"F1"),
		this.getpathmatrix(m,"BL1"),
		this.getpathmatrix(m,"BR1")];
    },
    resolveboost: function(n) {
	this.resolveactionmove(this.getboostmatrix(this.m),
	    function (t,k) { t.endaction(n,"BOOST"); },true,this.canmoveonobstacles("BOOST"));
    },
    resolvecoordinate: function(n) {
	var p=this.selectnearbyally(2);
	var self=this;
	if (p.length>0) {
	    this.resolveactionselection(p,(k) => {
		p[k].select();
		p[k].doaction(p[k].getactionlist(),"+1 free action").done(
		    () => this.select());
		this.endaction(n,"COORDINATE");
	    });
	}
    },
    candoarcrotate: function() { return this.hasmobilearc; },
    setarcrotate: function(r) { this.arcrotation=90*r; },
    resolvearcrotate: function(n,noaction) {
	var aux=this.weapons[0].auxiliary;
	var sectors=[];
	var self=this;
	for (var i=0; i<4; i++) { 
	    sectors[i]=s.path(aux.call(this,1,this.m.clone().rotate(i*90-this.arcrotation,0,0))).attr({fill:this.color,stroke:this.color,opacity:0.1}).appendTo(VIEWPORT);
	}
	for (var i=0; i<4; i++) {
	    (function(k) {
		sectors[k].hover(function() { sectors[k].attr({opacity:0.4}); }, function() { sectors[k].attr({opacity:0.1}); });
		sectors[k].click(function() { 
		    self.setarcrotate(k);
		    self.movelog("R-"+k);
		    self.log("Moving firing arc rotated");
		    for (var j=0; j<4; j++) {
			sectors[j].attr({display:"none"});
		    }
		    if (noaction==true)	self.endnoaction(n,"ARCMOBILE");
		    else self.endaction(n,"ARCMOBILE");
		});
	    })(i);
	}
    },
    canmoveonobstacles:function(type) { return false; },
    getdecloakmatrix: function(m) {
	var m0=this.getpathmatrix(m.clone().rotate(90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(m.clone().rotate(-90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	return [m.clone(),
		m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20),
		m1.clone().translate(0,-20),
		m1,
		m1.clone().translate(0,20),
		this.getpathmatrix(m.clone(),"F2")];
    },
    removecloaktoken: function() {
	this.agility-=2; 
	this.iscloaked=false;
	this.animateremovetoken("xcloaktoken");
	this.movelog("ct");
	if (!FAST) SOUNDS.decloak.play();
    },
    resolvedecloak: function(noskip) {
	var s="(or self to cancel)";
	if (noskip==true) s="(or self)";
	this.log("select position to decloak "+s);
	this.doselection(function(n) {
	    this.resolveactionmove(
		this.getdecloakmatrix(this.m),
		function (t,k) {
		    if (k>0||noskip==true) this.removecloaktoken();
		    this.hasdecloaked=true;
		    this.endnoaction(n,"DECLOAK");
		}.bind(this),true,this.canmoveonobstacles("DECLOAK"));
	}.bind(this))/*.done(function() {
	    this.unlock();
	}.bind(this))*/
	return true;
    },
    gettallonrollmatrix: function(m,maneuver) {
	var m0=this.getpathmatrix(m,maneuver);
	return [m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20)];
    },
    getrollmatrix:function(m) {
	var m0=this.getpathmatrix(m.clone().rotate(90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(m.clone().rotate(-90,0,0),"F1").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	p=[m0.clone().translate(0,-20),
	   m0,
	   m0.clone().translate(0,20),
	   m1.clone().translate(0,-20),
	   m1,
	   m1.clone().translate(0,20)];
	if (this.islarge) 	p=p.concat([m0.clone().translate(0,-40),
				   m0.clone().translate(0,40),
				   m1.clone().translate(0,-40),
				   m1.clone().translate(0,40)]);
	return p;
	
    },
    resolveroll: function(n) {
	this.resolveactionmove(this.getrollmatrix(this.m),
	    function(t,k) { t.endaction(n,"ROLL");},true,this.canmoveonobstacles("ROLL"));
    },
    boundtargets:function(sh) {
	if (this.targeting.indexOf(sh)>-1) return true;
	for (var i=this.targeting.length-1; i>=0; i--) this.removetarget(this.targeting[i]);
	return false;
    },
    addtarget: function(sh) {
	if (this.boundtargets(sh)) return;
	this.targeting.push(sh);
	this.animateaddtoken("xtargettoken");
	sh.istargeted.push(this);
	sh.animateaddtoken("xtargetedtoken");
	this.movelog("T-"+sh.id);
	sh.show();
	this.show();
    },
    gettargetableunits: function(n) {
	return this.selectnearbyenemy(n);
    },
    selectnearbyunits: function(n,f) {
	var p=[];
	for (var i in squadron) {
	    if (f(this,squadron[i])&&(this.getrange(squadron[i])<=n)) p.push(squadron[i]);
	}
	return p;
    },
    selectnearbyobstacle: function(n) {
	var p=[];
	var d=90000;
	var i,j,k;
	if (n==1) d=10000; else if (n==2) d=40000;
	for (k=0; k<OBSTACLES.length; k++) {
	    var ob=OBSTACLES[k];
	    if ((ob.type==DEBRIS||ob.type==ROCK)&&this.getdist(this.m,ob)<=d) p.push(ob);
	}
	return p;
    },
    selectnearbyally: function(n,f) {
	return this.selectnearbyunits(n,function(s,t) {
	    var b=true;
	    if (typeof f=="function") b=f(s,t);
	    return s.isally(t)&&s!=t&&b; });
    },
    selectnearbyenemy: function(n,f) {
	return this.selectnearbyunits(n,function(s,t) {
	    var b=true;
	    if (typeof f=="function") b=f(s,t);
	    return s.isenemy(t)&&b; });
    },
    isally: function(t) {
	return t.team==this.team;
    },
    isenemy: function(t) {
	return t.team!=this.team;
    },
    resolvetargetnoaction: function(n,noaction) {
 	var p=this.gettargetableunits(3);
	//this.log("select target to lock");
	this.resolveactionselection(p,function(k) { 
	    if (k>=0) this.addtarget(p[k]);
	    if (noaction==true) this.endnoaction(n,"TARGET"); else this.endaction(n,"TARGET");
	}.bind(this));
   },
    resolvetarget: function(n) {
	this.resolvetargetnoaction(n,false);
    },
    addcloaktoken: function() {
	this.iscloaked=true;
	this.agility+=2;
	this.animateaddtoken("xcloaktoken");
	this.movelog("CT");
	if (!FAST) SOUNDS.cloak.play();
    },
    addcloak: function(n) {
	this.addcloaktoken();
	this.endaction(n,"CLOAK");
    },
    resolveslam: function(n) {
	var gd=this.getdial();
	if (gd.length<=this.lastmaneuver) this.lastmaneuver=0;
	var realdial=gd[this.lastmaneuver].move;
	var speed=realdial.substr(-1);
	var p=[];
	var q=[];
	for (var i=0; i<gd.length; i++) 
	    if (gd[i].move.substr(-1)==speed) { 
		p.push(this.getpathmatrix(this.m,gd[i].move));
		q.push(i);
	    }
	this.log("select maneuver for SLAM");
	this.noattack=round;
	this.wrap_after("getdial",this,function(gd) {
	    var p=[];
	    for (var i=0; i<gd.length; i++) {
		p[i]={move:gd[i].move,difficulty:"WHITE"};
	    }
	    return p;
	}).unwrapper("endmaneuver");
	this.wrap_after("endmaneuver",this,function() {
	    this.endaction(n,"SLAM");
	}).unwrapper("endactivationphase");
	this.wrap_after("candoendmaneuveraction",this,function() {
	    return false;
	}).unwrapper("endphase");
	this.resolveactionmove(p,function(t,k) {
	    this.maneuver=q[k];
	    this.resolvemaneuver();
	}.bind(this),false,true);
    },
    enqueueaction: function(callback,org) {
	actionr.push($.Deferred());
	var n=actionr.length-1;
	if (typeof org=="undefined") org="undefined";
	//this.log("enqueueaction "+n+":"+org);
	actionr[n].name=org;
	if (n==0) callback(n); 
	else actionr[n-1].done(function() { 
	    //this.log("|| "+n+" execute "+actionr[n].name); 
	    callback(n);
	}.bind(this));
	return actionr[n];
    },
    endnoaction: function(n,type) {
	//this.log("*** "+n+" "+(actionr.length-1));
	actionr[n].resolve(type);
	//this.log("n="+n+" "+(actionr.length-1));
	if (n==actionr.length-1) {
	    actionrlock.resolve();
	}
	this.show();
    },
    endaction: function(n,type) {
	//this.log("endaction "+n+" "+type);
	if (phase==ACTIVATION_PHASE) $("#activationdial").show();
	this.clearaction();
	this.endnoaction(n,type);
    },
    resolveaction: function(a,n) {
	$("#actiondial").empty();
	if (a==null) this.endaction(n,null); 
	else {
	    this.actionsdone.push(a.name);
	    a.action.call(a.org,n);
	}
    },
    resolvenoaction: function(a,n) {
	$("#actiondial").empty();
	if (a==null) this.endnoaction(n,null);
	else a.action.call(a.org,n);
    },
    getrequirements: function(w) {
	return w.getrequirements();
    },
    evaluatetohit: function(w,sh) {
	var r=this.gethitrange(w,sh);
	if (sh!=this&&r<=3&&r>0) {
	    var attack=this.getattackstrength(w,sh);
	    var defense=sh.getdefensestrength(w,this);
	    var restorefocus=this.focus;
	    var restorereroll=this.reroll;
	    var wp=this.weapons[w];
	    // Check this: either one TL and no requirement, or more than one TL.
	    if (this.targeting.indexOf(sh)>-1) this.reroll=10;
	    if (wp.consumes==true
		&&"Target".match(this.getrequirements(wp))
		&&this.canusetarget(sh)) {
		this.reroll=0; 
	    }
	    // If TL and focus are required, use both...TODO
	    if (wp.consumes==true
		&&"Focus".match(this.getrequirements(wp))
		&&this.canusefocus()) {
		this.focus--; 
	    }
	    var thp= tohitproba(this,this.weapons[w],sh,
			      this.getattacktable(attack),
			      sh.getdefensetable(defense),
			      attack,
			      defense);
	    if (restorefocus) this.focus=restorefocus;
	    if (restorereroll) this.reroll=restorereroll;
	    return thp;
	} else return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    },
    isfireobstructed: function() {
	return this.ocollision.overlap>-1&&OBSTACLES[this.ocollision.overlap].type==ROCK;
    },
    hascollidedobstacle: function() {
	return this.ocollision.overlap>-1||this.ocollision.template.length>0;
    },
    canfire: function() {
 	var b=(this.noattack<round)&&(this.hasfired<this.maxfired)/*&&((r[1].length>0||r[2].length>0||r[3].length>0)*/&&!this.iscloaked&&!this.isfireobstructed();
        return b;
    },
    getattackstrength: function(i,sh) {
	var att=this.weapons[i].getattack();
	return att+this.weapons[i].getrangeattackbonus(sh);
    },
    getobstructiondef: function(sh) {
	return this.getoutlinerange(this.m,sh).o?1:0;
    },
    getdefensestrength: function(i,sh) {
	var def=this.getagility();
	var obstacledef=sh.getobstructiondef(this);
	if (obstacledef>0) this.log("+%0 defense for obstacle",obstacledef);
	return def+sh.weapons[i].getrangedefensebonus(this)+obstacledef;
    },
    hasnorerollmodifiers: function(from,to,m,n,modtype) {
	var mods=this.getdicemodifiers(); 
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to)
		if (d.type==MOD_M&&d.req(m,n)&&d.noreroll==modtype) return true;
	}
	return false;
    },
    getresultmodifiers: function(m,n,from,to) {
	var str="";
	var i,j;
	/* TODO: n,m should be removed */

	var getmod=function(a,i) {
	    var cl=a.str+(from==DEFENSE_M?"modtokend":"modtokena");
	    if (typeof a.token!="undefined") cl="x"+a.str+"token";
	    var e=$("<span>").addClass(cl).attr({id:"mod"+i,title:"modify roll ["+a.org.name+"]"}).html("");
		// should be from /to instead of just to.
	    e.click(function() { modroll(this.f,i,to); }.bind(a));
	    return e;
	};
	var getadd=function(a,i) {
	    var cl=a.str+(from==DEFENSE_M?"modtokend":"modtokena");
	    if (typeof a.token!="undefined") cl="x"+a.str+"token";
	    var e=$("<span>").addClass(cl).attr({id:"mod"+i,title:"add result ["+a.org.name+"]"}).html("");
		// should be from /to instead of just to.
	    e.click(function() { addroll(this.f,i,to); }.bind(a));
	    return e;
	}
	var getreroll=function(a,i) {
	    var n=a.n();
	    var s="R"+n;
	    var cl="tokens";
	    if (a.str) { cl="x"+a.str+"token"; s=""; }
	    var e=$("<span>").addClass(cl).attr({id:"reroll"+i,title:n+" rerolls["+a.org.name+"]"}).html(s);
	    e.click(function() { reroll(n,from,to,a,i); });
	    return e;
	};
	var mods=this.getdicemodifiers(); 
	var lm=[];
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==MOD_M&&d.req.call(this,m,n)) lm.push(getmod(d,i));
		if (d.type==ADD_M&&d.req.call(this,m,n)) lm.push(getadd(d,i)); 
		// should be from /to instead of just to.
		if (d.type==REROLL_M&&d.req.call(this,activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) lm.push(getreroll(d,i)); 
	    }
	}
	return lm;

    },
    addhasfired: function() { this.hasfired++; },
    resolveattack: function(w,targetunit) {
	var i;
	var r=this.gethitrange(w,targetunit);
	this.addhasfired();
	this.hasdamaged=false;
	displaycombatdial();
	var bb=targetunit.g.getBBox();
	var start=transformPoint(this.m,{x:0,y:-(this.islarge?40:20)});
	s.path("M "+start.x+" "+start.y+" L "+(bb.x+bb.w/2)+" "+(bb.y+bb.h/2))
	    .appendTo(VIEWPORT)
	    .attr({stroke:this.color,
		   strokeWidth:2,
		   strokeDasharray:100,
		   "class":"animated fireline"});
	this.select();	
	for (i in squadron) if (squadron[i]==this) break;
	this.preattackroll(w,targetunit);
	this.doselection(function(n) {
	    var attack=this.getattackstrength(w,targetunit);
	    this.doattackroll(this.attackroll(attack),attack,w,i,n);
	    //this.show();
	}.bind(this),"in combat")
	//this.show();
    },
    preattackroll:function(w,targetunit) {
    },
    predefenseroll:function(w,attacker) {
    },
    doattack: function(weaponlist,enemies) {
	this.activeweapons=weaponlist;
	this.activeenemies=enemies;
	this.showattack(weaponlist,enemies);
    },
    doattackroll: function(ar,ad,w,me,n) {
	ar=this.weapons[w].modifydamagegiven(ar);
	displayattackroll(ar,ad);
	//this.log("target:"+targetunit.name+" "+defense+" "+ar+" "+ad+" "+defense+" "+n+" me:"+squadron[me].name);
	this.ar=ar;this.ad=ad;
	displayattacktokens(this,function(t) {
	    targetunit.predefenseroll(w,t);
	    targetunit.defenseroll(targetunit.getdefensestrength(w,t)).done(function(r) {
		targetunit.dodefenseroll(r.roll,r.dice,me,n);
	    });
	});
    },
    dodefenseroll: function(dr,dd,me,n) {
	var i,j;
	this.dr=dr; this.dd=dd;
	displaydefenseroll(dr,dd);
	displaydefensetokens(this,function() {
	    this.resolvedamage();
	    this.endnoaction(n,"in combat");
	}.bind(squadron[me]));
    },
    drawpathmove:function(mm,path,lenC) {
	if (FAST) return;
	if (this.islarge) {
	    var m=mm.clone();
	    s.path('M 0 0 l 0 -20')
		.transform(m)
		.appendTo(VIEWPORT)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace");
	    var p=s.path(path.getSubpath(0,lenC-40)).attr("display","none");
	    p.clone()
		.transform(m.translate(0,-20))
		.appendTo(VIEWPORT)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace");
	    s.path('M 0 0 l 0 -20')
		.transform(this.getmatrixwithmove(mm,p,lenC-20))
		.appendTo(VIEWPORT)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace");
	} else {
	    s.path(path.getSubpath(0,lenC))
		.transform(mm)
		.attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",opacity:0.2,fill:"rgba(0,0,0,0)"})
		.addClass("trace")
		.appendTo(VIEWPORT);

	}	    
	this.show();
    },
    getmatrixwithmove: function(mm,path, len) {
	var lenC = path.getTotalLength();
	var m = mm.clone();
	if (lenC==0) return m;
	if (this.islarge) {
	    if (len<=20) m.translate(0,-len);
	    else {
		var over=(len>lenC+20)?len-lenC-20:0;
		var movePoint = path.getPointAtLength( len-over-20 );
		m.translate(movePoint.x,-20+movePoint.y).rotate(movePoint.alpha-90,0,0).translate(0,-over);
	    }
	} else {
	    var movePoint = path.getPointAtLength( len );
	    m.translate(movePoint.x,movePoint.y).rotate(movePoint.alpha-90,0,0);
	}
	return m
    },
    removestresstoken: function() {
	if (this.stress>0) {
	    this.stress--;
	    this.animateremovetoken("xstresstoken");
	    this.movelog("st");
	    this.show();
	}
    },
    handledifficulty: function(difficulty) {
	if (difficulty=="RED") {
	    this.addstress();
	} else if (difficulty=="GREEN" && this.stress>0) {
	    this.removestresstoken();
	}
    },
    revealmaneuver: function(dial) {
    },
    completemaneuver: function(dial,difficulty,halfturn,finalm) {
	var path=P[dial].path;
	var m,oldm;
	var lenC = path.getTotalLength();
	var m0=this.m.clone();
	if (dial.match(/RF1|RR1|RL1/)) m0=m0.rotate(180,0,0);
	if (this.islarge) lenC+=40;

	this.moves=[this.getmatrixwithmove(m0,path,lenC)];
	this.moves[0].move=dial;
	this.maneuverdifficulty=difficulty;
	if (dial=="F0") {
	    this.hasmoved=true;
	    if (halfturn) {
		this.m.rotate(180,0,0);
		this.movelog("m-"+dial+"-"+(180)%360+"-"+Math.floor(lenC));
	    }
	    this.handledifficulty(difficulty);
	    this.lastmaneuver=this.maneuver;
	    this.endmaneuver();
	    this.touching=[];
	    return;
	}
	this.collision=false; // Any collision with other units ?
	this.showhitsector(false);
	oldm=this.m;
	m = this.moves[0];

	var c=this.getcollidingunits(m);
	var col=[];
	if (c.length>0) {
	    this.log("collides with %0: no action",c[0].name);
	    this.collision=true;
	    while (lenC>0 && c.length>0) {
		col=c;
		lenC=lenC-1;
		m=this.getmatrixwithmove(m0,path,lenC);
		c=this.getcollidingunits(m);
	    }
	}
	this.drawpathmove(m0,path,lenC);
	
	// Handle collision: removes old collisions
	for (i=0; i<this.touching.length; i++) {
	    var sh=this.touching[i];
	    sh.touching.splice(sh.touching.indexOf(this),1);
	}
	this.touching=col;
	
   
	this.ocollision=this.getocollisions(m0,m,path,lenC);
	if (this.isfireobstructed()) { this.log("overlaps obstacle: cannot attack"); }
	if (this.hascollidedobstacle()) { this.log("unit or template overlaps obstacle: no action"); }
	if (lenC>0) this.m=m;
	var turn=0;
	// Animate movement
	if (lenC>0) {
	    this.hasmoved=true;
	    $("#activationdial").empty();
	    if (!FAST) SOUNDS[this.ship.flysnd].play();
	    Snap.animate(0, lenC, function( value ) {
		m = this.getmatrixwithmove(m0,path,value);
		if (dial.match(/RF1|RR1|RL1/)) m.rotate(180,0,0);
		this.g.transform(m);
		this.geffect.transform(m);
	    }.bind(this), TIMEANIM*lenC/200,mina.linear, function(){
		if (!this.collision) { 
		    // Special handling of K turns: half turn at end of movement. Straight line if collision.
		    if (dial.match(/K\d|SR\d|SL\d|RF1|RR1|RL1/)||halfturn==true) {
			this.m.rotate(180,0,0);
			turn=180;
		    } else if (dial.match(/TRL\d/)) {
			this.m.rotate(-90,0,0);
			turn=-90;
		    } else if (dial.match(/TRR\d/)) {
			if (typeof finalm!="undefined") this.m=finalm; 
			else this.m.rotate(90,0,0);
			turn=90;
		    } else {
		    }
		} 
		else { 
		}
		this.movelog("m-"+dial+"-"+(360+turn)%360+"-"+Math.floor(lenC));
		this.handledifficulty(difficulty);
		this.lastmaneuver=this.maneuver;
		//path.remove();
		if (this.hascollidedobstacle()) 
		    this.resolveocollision(this.ocollision.overlap,this.ocollision.template);
		if (this.ocollision.mine.length>0) 
		    for (i=0; i<this.ocollision.mine.length; i++) {
			this.ocollision.mine[i].detonate(this,false)
		    }
		if (this.collision) this.resolvecollision();
		this.endmaneuver();
	    }.bind(this));
	} else {
	    this.hasmoved=true;
	    this.log("cannot move");
	    this.handledifficulty(difficulty);
	    this.lastmaneuver=this.maneuver;
	    //path.remove();
	    if (this.collision) this.resolvecollision();
	    this.endmaneuver();
	}
    },
    getmaneuverlist: function() {
	var m=this.getmaneuver();
	var rm={};
	rm[m.move]=m;
	if (typeof m!="undefined") return rm;
	return {};
    },
    resolvemaneuver: function() {
	$("#activationdial").empty();
	// -1: No maneuver
	if (this.maneuver<0) return;
	var p=[],q=[];
	var ml=this.getmaneuverlist();
	for (var i in ml) {
	    q.push(ml[i]);
	    if (ml[i].move.match(/TRR\d|TRL\d/)) {
		var gtr=this.gettallonrollmatrix(this.m,ml[i].move);
		for (var j=0; j<gtr.length; j++) {
		    p.push(gtr[j]);
		    if (j>0) q.push(ml[i]);
		}
	    } else if (ml[i].halfturn==true&&!ml[i].move.match(/K\d|SR\d|SL\d/))
		p.push(this.getpathmatrix(this.m,ml[i].move).rotate(180,0,0));
	    else p.push(this.getpathmatrix(this.m,ml[i].move));
	}
	this.resolveactionmove(p,function(t,k) {
	    if (k==-1) k=0;
	    var dial=q[k].move;
	    var difficulty=q[k].difficulty;
	    if (q[k].halfturn!=true) q[k].halfturn=false; 
	    this.completemaneuver(dial,difficulty,q[k].halfturn,p[k]);
	}.bind(this), false,true);
    },
    endmaneuver: function() {
	var p=this.ionized;
	if (this.hasionizationeffect()) 
	    for (var i=0; i<p; i++) this.removeiontoken();
	this.maneuver=-1;
	this.hasmoved=true;
	this.show();
	this.moves=[];
	if (this.checkdead()) { this.hull=0; this.shield=0; } 
	else this.doendmaneuveraction();
	//this.log("endmaneuver");
	this.cleanupmaneuver();
    },
    cleanupmaneuver: function() {
	this.actionbarrier();
    },
    unlock:function(v) {
	this.show();
	return this.deferred.resolve(v);
    },
    newlock:function() {
	this.deferred=$.Deferred();
	return this.deferred.promise();
    },
    enddecloak: function() {
	return this.newlock();
    },
    candomaneuver: function() {
	return this.maneuver>-1;
    },
    addafterattackeffect: function(org,f) {
	this.wrap_after("afterattackeffect",org,f);
    },
    addafterdefenseeffect: function(org,f) {
	this.wrap_after("afterdefenseeffect",org,f);
    },
    isattacktwice: function() { return false; },
    addattack: function(f,org,weaponlist,effect,targetselector,wrapper,global) {
	var self=this;
	if (typeof wrapper=="undefined") wrapper="endattack";
	if (typeof global=="undefined") global=false;
	var obj=global?Unit.prototype:this;
	obj.wrap_after(wrapper,org,function(c,h) {
	    var anyactiveweapon=false;
	    //var attacker = getattacker.call();
	    if (wrapper=="removeshield"||wrapper=="endattack"||wrapper=="warndeath") attacker=activeunit;
	    else if (typeof attacker=="undefined") attacker=this;
	    for (i in weaponlist) if (weaponlist[i].isactive) {
		anyactiveweapon=true; break;
	    }
	    /*console.log("trigger for "+wrapper+":"+" noattack?"+(this.noattack<round)+" active?"+anyactiveweapon+" attacker?"+attacker.name+" "+c+" "+h+" "+this.isfireobstructed()+" f?"+f.call(this,c,h,attacker));*/
	    if (f.call(self,c,h,attacker)&&self.noattack<round&&anyactiveweapon
	       &&!self.iscloaked&&!self.isfireobstructed()) {
		var latedeferred=attacker.deferred;
		var fctattack=function() {
		    var enemies;
		    var wpl=[];
		    this.deferred=latedeferred;

		    if (typeof targetselector=="function") {
			enemies=targetselector.call(this);
		    } else enemies=this.selectnearbyenemy(3);
		    for (var i in weaponlist)
			if (weaponlist[i].isactive
			    &&weaponlist[i].getenemiesinrange(enemies).length>0)
			    wpl.push(weaponlist[i]);
		    //this.select();
		    if (wpl.length==0) {
			this.log("no available target for %0",org.name);
			this.cleanupattack();
			return; // No available target !
		    }
		    if (!f.call(this,c,h,attacker)) {
			this.cleanupattack();
			return;
		    }
		    this.log("+1 attack [%0]",org.name);
		    if (typeof effect=="function") 
			this.wrap_before("resolveattack",this,function() {
			    effect.call(this);
			}.bind(this)).unwrapper("cleanupattack");
		    this.maxfired++;
		    //for (var i in wpl) this.log("+1 attack with "+wpl[i].name);
		    this.doattack(wpl,enemies);
		}.bind(self);
		if (wrapper!="endcombatphase"&&wrapper!="warndeath"&&phase==COMBAT_PHASE) 
		    attacker.newlock().done(fctattack);
		else fctattack();
	    } 
	})
    },
    candoendmaneuveraction: function() { 
	return this.candoaction()
	    &&!this.collision
	    &&!this.hascollidedobstacle(); },
    doendmaneuveraction: function() {
	return this.doaction(this.getactionlist(true),"",this.candoendmaneuveraction);
	/*
	this.action=-1; 
	*/
    },
    doselection: function(f,org) {
	return this.enqueueaction(f,org);  
    },
    isactiondone: function(name) {
	return this.actionsdone.indexOf(name)!=-1;
    },
    doaction: function(list,str,candoaction) {
	if (typeof candoaction=="undefined") candoaction=this.candoaction;
	if (list.length==0) {
	    this.log("no action available");
	    return this.enqueueaction(function(n) {
		this.endnoaction(n);
	    }.bind(this),this.name);
	} 
	return this.enqueueaction(function(n) {
	    var i;
	    $("#actiondial").empty();
	    if (candoaction.call(this)) {
		this.select();
 		if (typeof str!="undefined"&&str!="") this.log(str);
		$("#actiondial").html($("<div>"));
		for (i=0; i<list.length; i++) {
		    if (!this.isactiondone(list[i].name)) {
			(function(k,h) {
			    var e=$("<div>").addClass("symbols").text(A[k.type].key)
				.click(function () { this.resolveaction(k,n); }.bind(this));
			    if (k.type=="BOMB") e.addClass("bombs");
			    e.attr("title",list[i].name);
			    if (list[i].name.slice(-2)=="/2") {
				e.css("color","yellow");
			    }
			    $("#actiondial > div").append(e);
			}.bind(this))(list[i],i);
		    }
		}
		var e=$("<button>").addClass("m-skip").addClass("wbutton").click(function() { this.resolveaction(null,n); }.bind(this));
		$("#actiondial > div").append(e);
	    } else this.endaction(n,null);
	}.bind(this),list[0].name);  
    },
    donoaction: function(list,str,noskip,skipaction) {
	var l;
	if (list.length==0) {
	    this.log("no action available");
	    return this.enqueueaction(function(n) {
		this.endnoaction(n);
	    }.bind(this),this.name);
	} 
	return this.enqueueaction(function(n) {
	    var i;
 	    if (typeof str!="undefined"&&str!="") this.log(str);
	    this.select();
	    $("#actiondial").html($("<div>"));
	    for (i=0; i<list.length; i++) {
		(function(k,h) {
		    var e=$("<div title='"+k.name+"'>").addClass("symbols").text(A[k.type].key)
			.click(function () { this.resolvenoaction(k,n) }.bind(this));
		    $("#actiondial > div").append(e);
		}.bind(this))(list[i],i);
	    }
	    if (noskip==true) {
		var e=$("<button>").addClass("m-skip").addClass("wbutton").click(function() { 
		    if (typeof skipaction=="function") skipaction();
		    this.resolvenoaction(null,n); 
		}.bind(this));
		$("#actiondial > div").append(e);
	    }
	}.bind(this),list[0].name);  
    },
    hasnostresseffect: function() {
	return this.stress==0;
    },
    candoaction: function() {
	return this.hasnostresseffect();
    },
    candecloak: function() {
	return (this.iscloaked&&phase==ACTIVATION_PHASE&&!this.hasdecloaked);
    },
    selecttargetforattack: function(wp,enemies) {
	var p;
	var str="";
	ENGAGED=true;
	p=this.weapons[wp].getenemiesinrange(enemies);
	if (p.length==0) {
	    this.log("no target for %0",this.weapons[wp].name);
	    this.cleanupattack();
	    return false;
	} else {
	    $("#attackdial").empty();
	    this.selectunit(p,function(q,k) {
		if (this.declareattack(wp,q[k])) 
		    this.resolveattack(wp,q[k]);
		else this.cleanupattack();
	    },[""],false);
	}
	return true;
    },
    showattack: function(weaponlist,enemylist) {
	var str="";
	var wn=[],wp=[];
	var i,j,w;
	$("#attackdial").show();
	if (typeof weaponlist=="undefined") weaponlist=this.weapons;
	//else this.attackweapons=weaponlist;
	var r=this.getenemiesinrange(weaponlist,enemylist);
	var d=$("<div>");
	for (w=0,j=0; w<weaponlist.length; w++) {
	    if (r[w].length>0) {
		wn[j++]=this.weapons.indexOf(weaponlist[w]);
	    }
	}
	var self=this;
	for (i=0; i<wn.length; i++) {
	    (function(ww) {
		var widx=A[self.weapons[ww].type.toUpperCase()];
		d.append($("<div>").attr({"class":"symbols "+ww.color})
			 .html(widx.key)
			 .click(function() {
			 self.selecttargetforattack(ww,enemylist)
			 }));
	    })(wn[i]);
	}
	d.append($("<button>").attr({"class":"m-skip wbutton"})
		 .click(function() {
		     this.cancelattack();
		 }.bind(this)));
	$("#attackdial").html(d);
    },
    cancelattack: function() {
	this.addhasfired();
	this.show();
	//console.log("cancelled attack");
	this.cleanupattack();
    },
    candotarget: function() {
	var l=this.gettargetableunits(3).length;
	return l>0;
    },
    candofocus: function() {
	return true;
    },
    candoevade: function() {
	return true;
    },
    candropbomb: function() {
	return (this.lastdrop!=round&&this.getskill()==skillturn);
    },
    addactivationdial: function(pred,action,html,elt) {
	this.activationdial.push({pred:pred,action:action,html:html,elt:elt});
    },
    actionbarrier:function() {
	actionrlock=$.Deferred();
	if (this.areactionspending()) {
	    actionrlock.done(function() { this.unlock() }.bind(this));
	} else {
	    actionrlock.resolve();
	    this.unlock();
	}
    },
    addafteractions: function(f) {
	actionrlock.done(f);
    },
    areactionspending: function() {
	for (var i=0; i<actionr.length; i++) {
	    //this.log(i+":"+actionr[i].state()+" "+actionr[i].name);
	    if (actionr[i].state()=="pending") return true;
	}
	//this.log("-> no action pending");
	return false;
    },
    dodecloak: function() {
	if (this.iscloaked) {
	    this.resolvedecloak();
	} else {
	    this.hasdecloaked=true;
	}
	this.actionbarrier();
    },
    getbomblocation: function() {
	return ["F1"];
    },
    getbombposition: function(lm,size) {
	var p=[];
	for (var i=0; i<lm.length; i++) {
	    p.push(this.getpathmatrix(this.m.clone().rotate(180,0,0),lm[i]).translate(0,(this.islarge?40:20)-size))
	}
	return p;
    },
    bombdropped: function() {},
    updateactivationdial: function() {
	var self=this;
	this.activationdial=[];
	if (this.candropbomb()&&(this.hasionizationeffect())) {
	    //this.log("ionized, cannot drop bombs");
	} else if (self.lastdrop!=round) {
	    switch(this.bombs.length) {
	    case 3: if (this.bombs[2].canbedropped()) 
		this.addactivationdial(
		    function() { return self.lastdrop!=round&&self.bombs[2].canbedropped(); },
		    function() { 
			self.lastdrop=round;
			$(".bombs").remove();
			self.bombs[2].actiondrop();
		    }, A["BOMB"].key,
		    $("<div>").attr({class:"symbols bombs",title:self.bombs[2].name}));
	    case 2:if (this.bombs[1].canbedropped()) 
		this.addactivationdial(
		    function() { return self.lastdrop!=round&&self.bombs[1].canbedropped(); },
		    function() { 
			self.lastdrop=round;
			$(".bombs").remove();			
			self.bombs[1].actiondrop();
		    }, A["BOMB"].key,
		    $("<div>").attr({class:"symbols bombs",title:self.bombs[1].name}));
	    case 1:if (this.bombs[0].canbedropped()) 
		this.addactivationdial(
		    function() { return self.lastdrop!=round&&self.bombs[0].canbedropped(); },
		    function() { 
			self.lastdrop=round;
			$(".bombs").remove();
			self.bombs[0].actiondrop();
		    }, A["BOMB"].key,
		    $("<div>").attr({class:"symbols bombs",title:self.bombs[0].name}));
	    }
	}
	return this.activationdial;
    },
    doactivation: function() {  	    
	/* TODO IA */
	if (!this.hasionizationeffect()) this.revealmaneuver(this.maneuver);
	this.showactivation(); 
    },
    showactivation: function() {
	$("#activationdial").html("<div></div>");
	if (!this.timeformaneuver()||this.areactionspending())  return;
	var ad=this.updateactivationdial();
	for (var i=0; i<ad.length; i++) {
	    (function(k) {
		var adi=ad[k];
		if (adi.pred()) { 
		    adi.elt.appendTo("#activationdial > div").click(function() { 
			$("#activationdial").html("<div></div>");
			adi.action();
		    }).html(adi.html);
		}
	    })(i);
	}
	$("<button>").addClass("m-move").addClass("wbutton").click(function() { 	
	    this.resolvemaneuver(); 
	}.bind(this)).appendTo("#activationdial > div");

    },
    movelog: function(s) {
	if (s.match(/L-%%.*/)) 
	    this.setinfo(decodeURIComponent(s.substring(4,s.length-2))).delay(1500).fadeOut(400);
	ANIM+="_"+this.id+"-"+s;
    },
    computepoints: function() {
    },
    error: function(str) {
	str=formatstring(str);
	log("<div><span style='color:red;font-weight:bold;'>**ERROR** ["+this.name+"]</span> "+str+"</div>");	
    },
    log: function(str,a,b,c) {
	if (NOLOG) return;
	if (typeof UI_translation[str]!="undefined") str=UI_translation[str];
	if (typeof a=="string") a=translate(a);
	str=str.replace(/%0/g,a)
	if (typeof b=="string") b=translate(b);
	str=str.replace(/%1/g,b)
	if (typeof c=="string") c=translate(c);
	str=str.replace(/%2/g,c)
	str=formatstring(str);
	log("<div><span style='color:"+this.color+"'>["+this.name+"]</span> "+str+"</div>");
    },
    candocloak: function() {
	return !this.iscloaked;
    },
    clearaction: function() { this.action=-1; },
    showaction:function() {
	if (this.action<this.actionList.length && this.action>-1) {
	    var a = this.actionList[this.action];
	    var c=A[a.type].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});
    },
    showinfo: function() {
	var i=0;
	var h=$("#"+this.id+" .usabletokens").html();
	var gut=this.getusabletokens();
	$("#"+this.id+" .usabletokens").html(gut);
	if (h!=gut) {
	    for (var j in squadron) {
		var u=squadron[j];
		if (this.isally(u)&&this.getskill()>=u.getskill())
		    u.showoverflow();
	    }
	}
	if (this.focus>0) {
	    this.infoicon[i++].attr({text:A.FOCUS.key,fill:A.FOCUS.color});}
	if (this.evade>0) {
	    this.infoicon[i++].attr({text:A.EVADE.key,fill:A.EVADE.color});}
	if (this.iscloaked==true) {
	    this.infoicon[i++].attr({text:A.CLOAK.key,fill:A.CLOAK.color});}
	if (this.targeting.length>0&&i<6) {
	    this.infoicon[i++].attr({text:A.TARGET.key,fill:A.TARGET.color});}
	if (this.istargeted.length>0) {
	    this.infoicon[i++].attr({text:A.ISTARGETED.key,fill:A.ISTARGETED.color});}
	if (this.stress>0&&i<6) {
	    this.infoicon[i++].attr({text:A.STRESS.key,fill:A.STRESS.color});}
	if (this.ionized>0&&i<6) {
	    this.infoicon[i++].attr({text:"Z",fill:A.STRESS.color});}
	if (this.tractorbeam>0&&i<6) {
	    this.infoicon[i++].attr({text:"Y",fill:A.STRESS.color});}
	for (var j=i; j<6; j++) {
	    this.infoicon[i++].attr({text:""});}	    
    },
    showoutline: function() {
        this.border.attr({ stroke:((activeunit==this)?this.color:halftone(this.color)) }); 
    }, 
    dock:function(parent) {
	this.isdocked=true;
	$("#"+this.id).attr("onclick","");
	$("#"+this.id).addClass("docked");
	$("#"+this.id).html(""+this);

	this.g.attr({display:"none"});
	this.geffect.attr({display:"none"});
	this.log("docked on %0",parent.name);
	this.show();
	parent.docked=this;
    },
    deploy: function(parent,dm) {
	this.movelog("DPY");
	$("#"+this.id).removeClass("docked");
	$("#"+this.id).html(""+this);
	$("#"+this.id+" .outoverflow").each(function(index) { 
	    if ($(this).css("top")!="auto") {
		$(this).css("top",$(this).parent().offset().top+"px");
	    }
	});
	$("#"+this.id).click(function() { this.select(); }.bind(this));
	this.g.attr({display:"block"});
	this.geffect.attr({display:"block"});
	this.m=parent.m.clone();
	this.isdocked=false;
	this.log("deploying from %0",parent.name);
	this.show();
	parent.docked=null;
	this.log("select maneuver for deployment");
	//this.wrap_after("timeformaneuver",this,function() { return true; }).unwrapper("endcombatphase");
	//this.wrap_after("canfire",this,function(t) { return false; }).unwrapper("endcombatphase");
	parent.doselection(function(n) {
	    this.resolveactionmove(dm,function(t,k) {
		var half=this.getdial().length;
		if (k>=half) { this.m.translate(0,-20); k=k-half; }
		else this.m.translate(0,20).rotate(180,0,0);
		this.maneuver=k;
		this.resolvemaneuver();
		//this.show();
	    }.bind(this),false,true);
	    parent.endnoaction(n,"DEPLOY");
	}.bind(this));
    },
    endcombatphase:function() { $(".fireline").remove(); },
    endphase: function() { },
    beginsetupphase: function() {
    },
    endsetupphase: function() {
    },
    beginplanningphase: function() {
	this.actionsdone=[];
	return this.newlock();
    },
    beginactivationphase: function() {
	return this.newlock();
    },
    timetoshowmaneuver: function() {
	return this.maneuver>-1&&phase<=ACTIVATION_PHASE;
    },
    getmaneuver: function() {
	if (this.hasionizationeffect()) {
	    return {move:"F1",difficulty:"WHITE"};
	}
	return this.getdial()[this.maneuver];
    },
    showmaneuver: function() {
	if (this.timetoshowmaneuver()) {
	    var d = this.getmaneuver();
	    var c  =C[(typeof this.forceddifficulty!="undefined")?this.forceddifficulty:d.difficulty];
	    if (!(activeunit==this)) c = halftone(c);
            this.dialspeed.attr({text:P[d.move].speed,fill:c});
            this.dialdirection.attr({text:P[d.move].key,fill:c});
	}
    },
    clearmaneuver: function() {
	this.dialspeed.attr({text:""});
	this.dialdirection.attr({text:""});
    },
    beginactivation: function() {
	//if (this.ionized>0) this.removeionized=true;
	this.showmaneuver();
	this.show();
    },
    endactivationphase: function() {
    },
    endplanningphase: function() {
    },
    hasionizationeffect: function() {
	    return ((this.ionized>0&&!this.islarge)||this.ionized>1);
    },
    begincombatphase: function() {
        return this.newlock();
    },
    beginattack: function() { },
    toString: function() {
	var n=0;
	var i,j,k;
	this.shipname=SHIP_translation[this.ship.name];
	if (typeof SHIP_translation[this.ship.name]=="undefined") this.shipname=this.ship.name;
	this.translatedname=translate(this.name);
	
	if (phase==SELECT_PHASE) {
	    var img=PILOTS[this.pilotid].dict;
	    if (PILOTS[this.pilotid].ambiguous==true
		&&typeof PILOTS[this.pilotid].edition!="undefined") 
		img+="-"+PILOTS[this.pilotid].edition.toLowerCase().replace(" ","");
	    this.imgname=img;
	    this.isunique=(PILOTS[this.pilotid].unique==true?false:true);
	    this.fire=this.weapons[0].getattack();
	    this.diallist=dial2JSON(this.getdial());
	    return Mustache.render(TEMPLATES["unit-creation"], this);
	} else {
	    var t=formatstring(getpilottexttranslation(this,this.faction));
	    this.id = squadron.indexOf(this);
	    if (t!="") this.tooltip=[t]; else this.tooltip=[];
	    n=8+this.upgrades.length*2;
	    this.hullpts2="";
	    this.shieldpts2="";
	    this.hullpts3="";
	    this.shieldpts3="";
	    if (this.hull+this.shield<=n) {
		this.hullpts=repeat("u ",this.hull);
		this.shieldpts=repeat("u ",this.shield);
	    } else if (this.hull>n) {
		this.hullpts=repeat("u ",this.hull);
		this.shieldpts="";
		if (this.hull<=n*2) {
		    this.hullpts2=repeat("u ",this.hull-n);
		    if (this.shield+this.hull<=n*2) {
			this.shieldpts2=repeat("u ",this.shield);
		    } else {
			this.shieldpts2=repeat("u ",n*2-this.hull);
			this.shieldpts3=repeat("u ",this.shield-n*2);
		    }
		} else {
		    this.hullpts2=repeat("u ",n);
		    this.hullpts3=repeat("u ",this.hull-n*2);
		    this.shieldpts3=repeat("u ",this.shield);
		}
	    } else {
		this.hullpts=repeat("u ",this.hull);
		this.shieldpts=repeat("u ",n-this.hull);
		this.shieldpts2=repeat("u ",this.shield-n+this.hull);
	    }
	    this.isinleft=(this.team==1);
	    this.conds=[];
	    for (i in this.conditions) {
		this.conds.push(this.conditions[i]);
	    }
	    var rendered = Mustache.render(TEMPLATES["unit-combat"], this);
	    return rendered;
	}
    },
    canusefocus: function() {
	return this.focus>0; 
    },
    canuseevade: function() {
	return this.evade>0;
    },
    canusetarget:function(sh) {
	return this.targeting.length>0
	    &&(typeof sh=="undefined" || this.targeting.indexOf(sh)>-1);
    },
    getusabletokens: function() {
	this.focuses=(this.focus>1?[this.focus]:[]);
	this.evades=(this.evade>1?[this.evade]:[]);
	this.stresses=(this.stress>1?[this.stress]:[]);
	this.ionizedes=(this.ionized>1?[this.ionized]:[]);
	this.tractorbeames=(this.tractorbeam>1?[this.tractorbeam]:[]);
	this.targetedname=[];
	this.targetingname=[];
	this.nomoreattack=(this.noattack==round);
	for (var j=0; j<this.istargeted.length; j++) 
	    this.targetedname[j]=this.istargeted[j].name.replace(/\'/g,"");
	for (var j=0; j<this.targeting.length; j++) 
	    this.targetingname[j]=this.targeting[j].name.replace(/\'/g,"");
	return Mustache.render(TEMPLATES["usabletokens"], this);
    },
    /*
    showskill:function() {
	var s=this.getskill();
	$("#unit"+this.id+" .statskill").html(s);
	$("#"+this.id+" .statskill").html(s);
    },*/
    showstats: function() {
	$("#unit"+this.id+" .statevade .val").html(this.getagility());
	//$("#unit"+this.id+" .statfire .val").html(this.weapons[0].getattack());
	if (phase==SELECT_PHASE) {
	    $("#unit"+this.id+" .stathull .val").html(this.ship.hull);
	    $("#unit"+this.id+" .statshield .val").html(this.ship.shield);
	} else {
	    this.skillbar.attr({text:repeat('u',this.getskill())});
	    this.firebar.attr({text:repeat('u',this.weapons[0].getattack())});
	    this.evadebar.attr({text:repeat('u',this.getagility())});
	    this.hullbar.attr({text:repeat('u',this.hull)});
	    this.shieldbar.attr({text:repeat('u',this.shield+this.hull)});
	    var n=8+this.upgrades.length*2;
	    if (this.hull+this.shield<=n) {
		$("#"+this.id+" .stat .hull").html(repeat("u ",this.hull));
		$("#"+this.id+" .stat .shield").html(repeat("u ",this.shield));
	    } else if (this.hull>n) {
		$("#"+this.id+" .stat .hull").html(repeat("u ",n));
		if (this.hull<=n*2) {
		    $("#"+this.id+" .stat2 .hull").html(repeat("u ",this.hull-n));
		    if (this.shield+this.hull<=n*2) 
			$("#"+this.id+" .stat2 .shield").html(repeat("u ",this.shield));
		    else {
			$("#"+this.id+" .stat2 .shield").html(repeat("u ",n*2-this.hull));
			$("#"+this.id+" .stat3 .shield").html(repeat("u ",this.shield-n*2+this.hull));		
		    }
		} else {
		    $("#"+this.id+" .stat2 .hull").html(repeat("u ",n));
		    $("#"+this.id+" .stat3 .hull").html(repeat("u ",this.hull-n*2));
		    $("#"+this.id+" .stat3 .shield").html(repeat("u ",this.shield));
		}
	    } else {
		$("#"+this.id+" .stat .hull").html(repeat("u ",this.hull));
		$("#"+this.id+" .stat .shield").html(repeat("u ",n-this.hull));
		$("#"+this.id+" .stat2 .shield").html(repeat("u ",this.shield-n+this.hull));
	    }
	}
    },
    showpanel: function() {
	var m=VIEWPORT.m.clone();
	var bbox=this.g.getBBox();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var min=Math.min(w/900.,h/900.);
	var x=startX+(m.x(bbox.x,bbox.y)+bbox.width/2)*min;
	var y=startY+(m.y(bbox.x,bbox.y))*min
	var mm=m.split();
	var d=mm.scalex;
	$(".phasepanel").css({left:x+d*(this.islarge?40:20),top:y}).show();
	//$("#positiondial button").hide();
    },
    timeformaneuver: function() {
	return  (this==activeunit&&this.maneuver>-1&&!this.hasmoved&&this.getskill()==skillturn&&phase==ACTIVATION_PHASE&&subphase==ACTIVATION_PHASE);
    },
    showoverflow: function() {
	if (!this.dead) { 
	    $("#"+this.id).html(""+this);
	    $("#"+this.id+" .outoverflow").each(function(index) { 
		if ($(this).css("top")!="auto") {
		    $(this).css("top",($(this).parent().offset().top)+"px");
		}
	    });
	}
    },
    show: function() {
	var i;
	if (phase==SELECT_PHASE) {
	    $("#unit"+this.id).html(this.toString());
	    return;
	}
	if (typeof this.g=="undefined") return;

	this.g.transform(this.m);
	this.g.appendTo(VIEWPORT); // Put to front
	this.geffect.transform(this.m);
	this.geffect.appendTo(VIEWPORT);
	this.showoutline();
	this.flameno++;
	this.showstats();
	this.showinfo();
	if (activeunit!=this) return;

	this.showpanel();
	this.showdial();
	this.showmaneuver();
	if (phase==ACTIVATION_PHASE) this.showactivation();
	if (!ENGAGED&&phase==COMBAT_PHASE){
	    if (this.canfire()&&!this.areactionspending()&&!INREPLAY) this.showattack(this.activeweapons,this.activeenemies); 
	    else $("#attackdial").empty();
	}
	this.showoverflow();
    },
    updatetohit: function(b,wp) {
	var w=this.weapons[wp];
	var e=w.getenemiesinrange();
	if (!b) 
	    for (var i in e) delete e[i].tohitstats[this.id];
	else for (var i in e) e[i].tohitstats[this.id]={unit:this,weapon:wp};

	for (var i in e) {
	    var u=e[i];
	    NOLOG=true;
	    var tohit=1;
	    var meanhit=0;
	    var meancrit=0;
	    var focus=u.focus;
	    var evade=u.evade;
	    var p=[];
	    for (var j in u.tohitstats) {
		var v=u.tohitstats[j];
		var w=v.weapon;
		if (typeof v.unit=="undefined") continue;
		var ss=v.unit.evaluatetohit(v.weapon,u);
		tohit *=(1-ss.tohit/100.);
		meanhit+=ss.meanhit;
		meancrit+=ss.meancritical;
		if (u.focus>0) u.focus--;
		if (u.evade>0) u.evade--;
		p=[];
		while (typeof v.unit.weapons[w].followupattack=="function"
		       &&p.indexOf(w)==-1) {
		    p.push(w);
		    var ww=w;
		    w=v.unit.weapons[w].followupattack();
		    ss=v.unit.evaluatetohit(w,u);
		    tohit *=(1-ss.tohit/100.);
		    meanhit+=ss.meanhit;
		    meancrit+=ss.meancritical;
		    if (u.focus>0) u.focus--;
		    if (u.evade>0) u.evade--;
		}
	    }
	    u.tohitstats.tohit=tohit;
	    u.tohitstats.meanhit=meanhit;
	    u.tohitstats.meancrit=meancrit;
	    u.evade=evade;
	    u.focus=focus;
	    NOLOG=false;
	}
    },
    displaytohit: function(wp) {
	var w=this.weapons[wp];
	var e=w.getenemiesinrange();
	// Display
	for (var i in e) {
	    var u=e[i];
	    var tohit=1-u.tohitstats.tohit;
	    var hit=u.tohitstats.meanhit;
	    var crit=u.tohitstats.meancrit;
	    if (hit==0) u.gproba.attr({display:"none"});
	    else {
		var r=-u.m.split().rotate;
		u.gproba.transform("r "+r+" 0 0").attr({display:"block"});
		u.tohit.attr({text:Math.floor(tohit*100)+"%"});
		u.meanhit.attr({text:Math.floor(hit*100)/100});
		u.meancrit.attr({text:Math.floor(crit*100)/100});
	    }
	    u.show();
	}
    },
    showhitsector: function(b,wp) {
        var opacity=(b)?"inline":"none";
	this.select();
	if (typeof wp=="undefined") wp=0;
	var w=this.weapons[wp];
	if (!b) {
	    for (i=0; i<this.sectors.length; i++) this.sectors[i].remove();
	    for (i=0; i<this.ranges.length; i++) this.ranges[i].remove();
	    this.ranges=[];
	    this.sectors=[];
	    this.updatetohit(b,wp);
	    this.displaytohit(wp);
	    return;
	}
	var r0=w.getlowrange(), r1=w.gethighrange();
	if (w.isTurret()||this.isTurret(w)) {
	    this.showrange(b,r0,r1);
	} else {
	    var i,k;
	    if (r0==1) {
		for (i=r0;i<=r1; i++) { 
		    this.sectors.push(s.path(this.getPrimarySectorString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof w.auxiliary!="undefined") {
		    var aux=w.auxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		} 
	    } else {
		for (i=r0; i<=r1; i++) {
		    this.sectors.push(s.path(this.getPrimarySubSectorString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		}
		if (typeof w.subauxiliary!="undefined") {
		    var aux=w.subauxiliary;
		    for (i=r0;i<=r1; i++) { 
			this.sectors.push(s.path(aux.call(this,r0-1,i,this.m.clone())).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
		    }
		}

	    }
	}
	this.updatetohit(b,wp);
	this.displaytohit(wp);
    },
    showrange: function(b,r0,r1) {
        var opacity=(b)?"inline":"none";
	var i,j;
	this.select();
	if (!b) {
	    for (i=0; i<this.ranges.length; i++) 
		this.ranges[i].remove();
	    this.ranges=[];
	    return; 
	}
	if (r0==1) {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getRangeString(i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
	} else {
	    for (i=r0; i<=r1; i++) 
		this.ranges.push(s.path(this.getSubRangeString(r0-1,i,this.m)).attr({fill:this.color,stroke:this.color,opacity:0.1,pointerEvents:"none"}).appendTo(VIEWPORT));
	}  
    },
    togglehitsector: function(w) {
	var b;
	if (this.sectors.length+this.ranges.length>0) b=false; else b=true;
	this.showhitsector(b,w);
    },
    togglerange: function() {
	var b;
	if (this.ranges.length>0) b=false; else b=true;
	this.showrange(b,1,3);
    },
    isPointInside:function(path,op) {
	for (var i=0; i<op.length; i++) 
	    if (Snap.path.isPointInside(path,op[i].x,op[i].y)) return true;
	return false;
    },
    isinsector: function(m,n,sh,getSubSectorString,getSectorString,flag) {
	var o1;
	var o2=sh.getOutlineString(sh.m);
	if (n>1) o1=getSubSectorString.call(this,n-1,n,m); else o1=getSectorString.call(this,n,m);	
	return (o1!=null&&(Snap.path.intersection(o2.s,o1).length>0
	       		   ||this.isPointInside(o1,o2.p)));
    },
    isinfiringarc: function(sh) {
	return this.getsector(sh)<=3;
    },
    isinprimaryfiringarc: function(sh) {
	return this.getprimarysector(sh)<=3;
    },
    /* Primary and auxiliary, only first weapon. TODO: m useless ? weapon 0 ?*/
    getsector: function(sh,m) {
	return this.weapons[0].getsector(sh);
    },
    /* Primary only */
    getprimarysector: function(sh,m) {
	var i;
	if (typeof m=="undefined") m=this.m;
	var n=this.getoutlinerange(m,sh).d;
	for (i=n; i<=n+1&&i<=3; i++) 
	    if (this.isinsector(m,i,sh,this.getPrimarySubSectorString,this.getPrimarySectorString)) return i;
	return 4;
    },
    isinoutline: function(o1,sh,m) {
	return this.isPointInside(o1,sh.getOutlinePoints(m));
    },
    checkcollision: function(sh) {
	return (this.touching.indexOf(sh)>-1);
    },
    resolvecollision: function() {
	var i;
	if (typeof this.touching == "undefined") this.touching=[];
	for (i=0; i<this.touching.length; i++) {
	    var u=this.touching[i];
	    if (u.touching.indexOf(this)==-1) {
		u.touching.push(this);
		u.collidedby(this);
	    }
	}   
    },
    collidedby: function(sh) {
    },
    canhavehitocollision: function() { return true; },
    canhavecriticalocollision: function() { return true; },
    resolveocollision: function(o,t) {
	var i;
	var p=t;
	if (p.indexOf(o)==-1&&o>-1) p.push(o);
	for (i=0; i<p.length; i++) {
	    var roll=this.rollattackdie(1,OBSTACLES[p[i]],"blank")[0];
	    switch(roll){
	    case "focus": this.log("roll for collision: <span class='focusreddice'></span>"); break;
	    case "hit": this.log("roll for collision: <span class='hitreddice'></span>"); break;
	    case "blank": this.log("roll for collision: <span class='blankreddice'></span>"); break;
	    case "critical": this.log("roll for collision: <span class='criticalreddice'></span>"); break;
	    }
	    if (OBSTACLES[p[i]].type==ROCK) {
		if (roll=="hit"&&this.canhavehitocollision()) {
		    this.log("+1 %HIT% [collision]"); 
		    this.resolvehit(1); 
		    this.checkdead(); 
		} else if (roll=="critical"
			   &&this.canhavecriticalocollision())   {
		    this.log("+1 %CRIT% [collision]"); 
		    this.resolvecritical(1);
		    this.checkdead();
		}
	    } else if (OBSTACLES[p[i]].type==DEBRIS) {
		this.addstress();
		if (roll=="critical") {
		    this.log("+1 %CRIT% [debris collision]"); 
		    this.resolvecritical(1);
		    this.checkdead();		
		}
	    }
	}
    },
    addshield: function(n) {
	this.movelog("S-"+n);
	if (this.shield<this.ship.shield) this.animateaddtoken("cshield");
	this.shield+=n;
	if (this.shield>this.ship.shield) { 
	    this.shield=this.ship.shield;
	    return true;
	} else return false;
    },
    addhull: function(n) {
	this.movelog("H-"+n);
	if (this.hull<this.ship.hull) this.animateaddtoken("chull");
	this.hull+=n;
	if (this.hull>this.ship.hull) this.hull=this.ship.hull;
    },
    animateremovetoken: function(type) {
	if (FAST) return;
	var m=VIEWPORT.m.clone();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var max=Math.max(900./w,900./h);
	var bbox=this.g.getBBox();
	var p=$("#svgout").offset();
	var min=Math.min($("#playmat").width(),$("#playmat").height());
	var x=m.x(bbox.x,bbox.y)/max;
	x+=p.left+startX;
	var y=m.y(bbox.x,bbox.y)/max;
	y+=p.top+startY;
	$("<div>").addClass("upanim").css({left:x,top:y}).html("<code class='"+type+"'></code>").appendTo("body").show();
    },
    animateaddtoken: function(type) {
	if (FAST) return;
	var m=VIEWPORT.m.clone();
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var startX=0;
	var startY=0;
	if (h>w) startY=(h-w)/2;
	else startX=(w-h)/2;
	var max=Math.max(900./w,900./h);
	var bbox=this.g.getBBox();
	var p=$("#svgout").offset();
	var min=Math.min($("#playmat").width(),$("#playmat").height());
	var x=m.x(bbox.x,bbox.y)/max;
	x+=p.left+startX;
	var y=m.y(bbox.x,bbox.y)/max;
	y+=p.top+startY;
	$("<div>").addClass("downanim").css({left:x,top:y}).html("<code class='"+type+"'></code>").appendTo("body").show();
    },
    removeshield: function(n) {
	if (this.shield>0) this.animateremovetoken("cshield");
	this.shield=this.shield-n;
	this.movelog("s-"+n);
	if (this.shield<0) this.shield=0;
	var r=TEAMS[this.team].history.rawdata;
	if (typeof r[round]=="undefined") r[round]={hits:0,dead:""};
	r[round].hits+=n;
    },
    resolvehit: function(n) {
	var s=0;
	if (n==0) return 0;
	if (this.shield>n) this.removeshield(n);
	else {
	    s=n-this.shield;
	    this.removeshield(this.shield);
	    if (s>0) this.applydamage(s);
	}	    
	this.show();
	return s;
    },
    resolvecritical: function(n) {
	var s=0;
	if (n==0) return 0;
	if (this.shield>n) this.removeshield(n);
	else {
	    var s=n-this.shield;
	    this.removeshield(this.shield)
	    if (s>0) this.applycritical(s);
	}
	this.show();
	return s;
    },
    removehull: function(n) {
	if (this.hull>0) this.animateremovetoken("chull");
	this.hull=this.hull-n;
	this.movelog("h-"+n);
	var r=TEAMS[this.team].history.rawdata;
	if (typeof r[round]=="undefined") r[round]={hits:0,dead:""};
	r[round].hits+=n;
	this.log("-%0 %HULL%",n);
	if (this.hull<=this.ship.hull/2) this.imgsmoke.attr({display:"block"});
	if (this.hull==1) {
	    this.imgsmoke.attr({display:"none"});
	    this.imgflame.attr({display:"block"});
	}
    },
    selectunit: function(p,f,astr,cancellable) {
	if (cancellable) p.push(this);
	if (p.length>0) {
	    this.doselection(function(n) {
		if (typeof astr!="undefined"&&astr[0]!="") this.log.apply(this,astr);
		this.resolveactionselection(p,function(k) {
		    if (!cancellable||this!=p[k]) f.call(this,p,k);
		    this.endnoaction(n,"SELECT");
		}.bind(this));
	    }.bind(this),"selectunit");
	}
    },
    selectcritical: function(crits,endselect) {
	var resolve=function(c,n) {
	    $("#actiondial").empty();
	    endselect(c);
	    this.endnoaction(n,"CRITICAL");
	}.bind(this);
	this.doselection(function(n) {
	    var i,str="";
	    $("#actiondial").empty();
	    for (var i=0; i<crits.length; i++) {
		(function(k) {
		    var e=$("<button>").text(CRITICAL_DECK[crits[k]].name)
			.click(function() { resolve(crits[k],n);}.bind(this));
		    $("#actiondial").append(e);
		}.bind(this))(i);
	    }
	    $("#actiondial").show();
	}.bind(this),"critical");
    },
    selectupgradetodesactivate: function(upglist,self) {
	var resolve=function(u,n) {
	    $("#actiondial").empty();
	    if (u!=null) {
		u.desactivate();
		u.unit.show();
		self.desactivate();
		this.log("desactivating %0 [%1]",u.name,this.name);
	    }
	    this.endnoaction(n,"CREW");
	}.bind(this);
	this.doselection(function(n) {
	    var i,str="";
	    $("#actiondial").empty();
	    for (var i=0; i<upglist.length; i++) {
		(function(k) {
		    var e=$("<button>").text(upglist[k].name)
			.click(function() { resolve(upglist[k],n);});
		    $("#actiondial").append(e);
		}.bind(this))(i);
	    }
	    var e=$("<button>").addClass("m-skip").addClass("wbutton").click(function() { resolve(null,n); });
	    $("#actiondial").append(e);
	    $("#actiondial").show();
	}.bind(this),"upgrade");
    },

    selectdamage: function() {
	var i,s=0,m,j;
	for (i=0; i<CRITICAL_DECK.length; i++) 
	    if (CRITICAL_DECK[i].version.indexOf(CURRENT_DECK)>-1)
		s+=CRITICAL_DECK[i].count;
	var r=this.rand(s);
	m=0;
	for (i=0; i<CRITICAL_DECK.length; i++) {
	    if (CRITICAL_DECK[i].version.indexOf(CURRENT_DECK)>-1){
		m+=CRITICAL_DECK[i].count;
		if (m>r) return i;
	    }
	}
	return 0;	
    },
    applydamage: function(n) {
	var s,j;
	for (j=0; j<n; j++) {
	    s=this.selectdamage();
	    CRITICAL_DECK[s].count--;
	    var cr=new Critical(this,s);
	    this.deal(cr,FACEDOWN).done(function(c) {
		switch(c.face) {
		case FACEUP: c.crit.faceup(); this.movelog("c-"+s);
		case FACEDOWN: this.removehull(1); 
		    this.checkdead(); 
		    break;
		case DISCARD: this.criticals.slice(this.criticals.indexOf(cr),1);
		}
		this.show();
	    }.bind(this));
	}
    },
    applycritical: function(n) {
	var s,j;
	for (j=0; j<n; j++) {
	    s=this.selectdamage();
	    CRITICAL_DECK[s].count--;
	    var cr=new Critical(this,s);
	    this.deal(cr,FACEUP).done(function(c) {
		switch(c.face) {
		case FACEUP: c.crit.faceup(); this.movelog("c-"+s);
		case FACEDOWN: this.removehull(1); break;
		case DISCARD: this.criticals.slice(this.criticals.indexOf(cr),1);
		}
		this.show();
	    }.bind(this));
	}
    },
    deal: function(crit,face) {
	var dd=$.Deferred();
	return dd.resolve({crit:crit,face:face});
    },

    gethitrange: function(w,sh) {
	if (this.isally(sh)) return 0;
	var gr=this.weapons[w].getrange(sh);
	return gr;
    },
    getenemiesinrange: function(weaponlist,enemylist) {
	var str='';
	var k,i;
	var range=[];
	if (typeof weaponlist=="undefined") weaponlist=this.weapons;
	for(i=0; i<weaponlist.length; i++) {
	    range[i]=weaponlist[i].getenemiesinrange(enemylist);
	}
	return range;
    },
    getrange: function(sh) {
	return this.getoutlinerange(this.m,sh).d;
    },
    getdist:function(mm,sh) {
	var ro=this.getOutlinePoints(mm);
	var rsh = sh.getOutlinePoints(sh.m);
	var min=-1;
	var i,j,k;
	var minobs=false,mini,minj;
	for (i=0; i<ro.length; i++) {
	    for (j=0; j<rsh.length; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min||min==-1) { min=d;}
	    }
	}
	return min;
    },
    // Returns the range separating both units and if an obstacle is inbetween
    getoutlinerange:function(m,sh) {
	var ro=this.getOutlinePoints(m);
	var rsh = sh.getOutlinePoints(sh.m);
	var min=90001;
	var i,j,k=0;
	var str="";
	var obs=false;
	var minobs=false,mini,minj;
	for (i=0; i<4; i++) {
	    for (j=0; j<4; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min) { min=d; mini=i; minj=j;}
	    }
	}
	if (min>90000) return {d:4,o:false};
	var dx=rsh[minj].x-ro[mini].x;
	var dy=rsh[minj].y-ro[mini].y;
	var a=-ro[mini].x*dy+ro[mini].y*dx; //(x-x0)*dy-(y-y0)*dx>0
	if (OBSTACLES.length>0) {
	    for (k=0; k<OBSTACLES.length; k++) {
		if (OBSTACLES[k].type==NONE) continue;
		var op=OBSTACLES[k].getOutlineString().p;
		// The object is not yet intialized. Should not be here...
		if (op.length==0||OBSTACLES[k].type==BOMB) break;
		var s=op[0].x*dy-op[0].y*dx+a;
		var v=s;
		for (i=1; i<op.length; i++) {
		    if (dist(rsh[minj],op[i])<1.2*min&&
			dist(ro[mini],op[i])<1.2*min) {
			v=op[i].x*dy-op[i].y*dx+a;
			if (v*s<0) break; 
		    }
		}
		if (v*s<0) break;
	    }
	}
	if (k<OBSTACLES.length) obs=true;
	if (min<=10000) {return {d:1,o:obs}; }
	if (min<=40000) { return {d:2,o:obs}; }
	return {d:3,o:obs};
    },

    getrangeallunits: function() {
	var range=[[],[],[],[],[]],i;
	for (i in squadron) {
	    var sh=squadron[i];
	    if (sh!=this) {
		var k=this.getrange(sh);
		range[k].push({unit:i});
	    }
	};
	return range;
    }
};
/*
Espilon ace rule
Chopper crew (was working like Chopper pilot)
*/

function metaUnit() {
    this.ordnance=false;
    this.touching=[];
    this.focus=0;
    this.stress=0;
    
}
metaUnit.prototype= {
    resolveactionselection: function(units,cleanup) {
	cleanup(0);
    },
    selectcritical: function(crits,endselect) {
	for (var i=0; i<crits.length; i++) {
	    if (CRITICAL_DECK[crits[i]].lethal==false) {
		endselect(crits[i]); return;
	    }
	}
	endselect(crits[0]);
    },
    animateaddtoken: function() {},
    animateremovetoken: function() {},
    dodecloak: function() {
	if (this.shipactionList.indexOf("CLOAK")>-1) 
	    this.resolvedecloak();
    },
    resolvedecloak: function() {
	var p=[];
	var k=0;
	for (var i=0; i<this.moves.length; i++) {
	    var ml=this.getdecloakmatrix(this.moves[i]);
	    for (var j=0; j<ml.length; j++) p[k++]=ml[j];
	}
	this.moves=p;
    },
    isactiondone: function(a) {
	return false;
    },
    addstress: function() {
	this.stress++;
    },
    removestresstoken:function() {
	this.stress--;
    },
    addtarget: function(sh) {
	for (var i=0; i<this.moves.length; i++) {
	    this.moves[i].targeting=[targetunit];
	    this.moves[i].reroll=9;
	}
	this.targeting=[targetunit];
    },
    removetarget: function(t) {
	var n=this.targeting.indexOf(t);
	if (n>-1) this.targeting.splice(n,1);
    },
    addfocustoken: function() { this.focus++; },
    removefocustoken: function() { this.focus--; },
    initcounters: function(m) {
	m.BOOST=false;
	m.ROLL=false;
	m.focus=0;
	m.stress=0;
	m.move="";
	m.reroll=0;
	m.targeting=[];
	this.m=m;
    },
    resolvemaneuver: function() {
	var i,j,k;
	k=0;
	this.maneuver=0;
	this.stress=0;
	this.focus=0;
	this.targeting=[];
	var ml=this.getmaneuverlist();
	var p=[];
	for (i in ml) {
	    var mli=ml[i];
	    for (j=0; j<this.moves.length; j++) {
		var m;
		this.stress=0;
		this.focus=0;
		this.targeting=[];
		m=this.getpathmatrix(this.moves[j],mli.move,mli.halfturn);
		this.initcounters(m);
		this.handledifficulty(mli.difficulty);
		m.stress=this.stress;
		m.focus=this.focus;
		m.reroll=0;
		m.targeting=this.targeting;
		m.move=mli.move;
		p[k++]=m;
	    }
	}
	this.moves=p;
	this.endmaneuver();
    },
    endmaneuver: function() {
	if (this.candoendmaneuveraction()) this.doendmaneuveraction();
    },
    candoendmaneuveraction: function() { return true; },
    doendmaneuveraction: function() {
	this.doaction(this.getactionlist(true));
    },
    movelog: function() {},
    showdial: function() {},
    showactivation: function() {},
    timetoshowmaneuver: function() {},
    doactivation: function() {
	this.beginactivation();
	this.dodecloak();
	this.resolvemaneuver();
	this.endactivationphase();
    },
    log: function() { },
    beginactivation: function() {},
    endactivationphase: function() {},
    showaction: function() {},
    donoaction:function(list,str) {
	this.doaction(list,str);
    },
    resolveboost: function() {
	var p=[];
	var k=0;
	for (var i=0; i<this.moves.length; i++) {
	    var m=this.moves[i];
	    if (!m.BOOST) {
		var bl=this.getboostmatrix(m);
		for (var j=0; j<bl.length; j++) { 
		    bl[j].BOOST=true;
		    bl[j].ROLL=m.ROLL;
		    bl[j].reroll=m.reroll;
		    bl[j].stress=m.stress;
		    bl[j].focus=m.focus;
		    bl[j].move=m.move;
		    bl[j].targeting=m.targeting;
		    p[k++]=bl[j];
		} 
	    } 
	    p[k++]=m;
	}
	this.moves=p;
	this.endaction(0,"BOOST");
    },
    resolvefocus: function() {
	var p=[];
	for (var i=0; i<this.moves.length; i++) {
	    p[i]=this.moves[i].clone();
	    p[i].move=this.moves[i].move;
	    p[i].targeting=this.targeting;
	    if (p[i].targeting.length>0) p[i].reroll=9; else p[i].reroll=0;
	    p[i].focus=1;
	}
	this.moves=p;
	this.endaction(0,"FOCUS");
    },
    resolvetargetnoaction: function(n,noaction) {
	var p=[];
	for (var i=0; i<this.moves.length; i++) {
	    p[i]=this.moves[i].clone();
	    p[i].move=this.moves[i].move;
	    p[i].targeting=[targetunit];
	    p[i].reroll=9;
	}
	this.moves=p;
	this.endaction(0,"TARGET");
    },
    gettargetableunits: function(r) {
	if (r==this.range) return [targetunit];
	return [];
    },
    selectunit: function(tab,f) {
	if(tab.length>0) f.call(this,tab,0);
    },
    resolveroll: function() {
	var p=[];
	var k=0;
	for (var i=0; i<this.moves.length; i++) {
	    var m=this.moves[i];
	    if (!m.ROLL) {
		var bl=this.getrollmatrix(m);
		for (var j=0; j<bl.length; j++) {
		    bl[j].ROLL=true;
		    bl[j].BOOST=m.BOOST;
		    bl[j].reroll=m.reroll;
		    bl[j].focus=m.focus;
		    bl[j].stress=m.stress;
		    bl[j].move=m.move;
		    bl[j].targeting=m.targeting;
		    p[k++]=bl[j];
		}
	    }
	    p[k++]=m;
	}
	this.moves=p;
	this.endaction(0,"ROLL");
    },
    uniquearray: function(arr) {
	var u = {}, a = [];
	for(var i = 0, l = arr.length; i < l; ++i){
            if(!u.hasOwnProperty(arr[i])) {
		a.push(arr[i]);
		u[arr[i]] = 1;
            }
	}
	return a;
    },
    doaction: function(list,str,cando) {
	var nostress=[];
	var stressed=[];
	var org=[];
	var k=0,h=0;
	var p=[];
	for (var i=0; i<this.moves.length; i++) {
	    this.stress=0;
	    if (this.moves[i].stress>0) {
		this.stress=this.moves[i].stress;
	    }
	    if (this.hasnostresseffect()) nostress[k++]=this.moves[i];
	    else stressed[h++]=this.moves[i];
	}
	for (var i=0; i<list.length; i++) {
	    this.moves=nostress;
	    //console.log("TYPE of ACTION:"+list[i].type);
	    switch(list[i].type) {
	    case "ROLL":  
		this.resolveroll(); 
		break;
	    case "BOOST":
		this.resolveboost(); 
		break;
	    case "FOCUS":
		this.resolvefocus();
		this.addfocustoken();
		break;
	    case "TARGET":
		this.resolvetarget(0,false);
		break;
	    case "ELITE":
		list[i].action(0); break;
	    }
	    p=p.concat(this.moves);
	}
	this.moves=p.concat(stressed);
	return $.Deferred().resolve().promise();
    },
    /*resolveactionmove: function(list,fun) {
	var p=this.moves;
	for (var i=0; i<list.length; i++) {
	    p=p.concat(
	}
    },*/
    candotarget: function() { return true;},
    candoaction: function() { return true;},
    candoroll: function() { return true;},
    candoboost: function() { return true;},
    endaction: function(n,type) {},
    getmaneuverlist: function() {
	var d=this.getdial();
	var p={};
	for (var i=0; i<d.length; i++) {
	    p[d[i].move]=d[i];
	}
	return p;
    },
    getrange: function() { return this.range; },
    getsector: function() { return this.range; },
    getoutlinerange:function(m,sh) {
	return {d:this.range};
    },
    isinsector: function() { return true; },
    checkcollision:function() {	return false; },
    isally:function() { return false;  },
    isenemy: function() { return true; },
    begincombatphase: function() { },
    selectnearbyenemy:function(r) {
	if (this.range==r) return [targetunit];
	return [];
    },
    doselection: function() {},
    setinfo: function(info,event) {
	var w=$("#unit"+this.id+" .statisticsvg").width();
	var h=$("#unit"+this.id+" .statisticsvg").height();	
	var p=$("#unit"+this.id+" .statisticsvg").offset();
	var x=event.pageX+20;
	var y=event.pageY;
	return $(".info").css({left:x,top:y}).html(formatstring(info)).appendTo("body").show();
    },
/*


*/
    resolveattack: function(w,target) {
    },
    cleanupattack: function() {
    },
    showattack: function(weaponlist,s) {
	var p=this.moves;
	var power=[];
	var h=0;
	for (var i=3; i>=1; i--) {
	    this.range=i;
	    this.focus=0;
	    this.reroll=0;
	    this.begincombatphase();
	    var ff=this.focus;
	    for (var j=0; j<weaponlist.length; j++) {
		var w=weaponlist[j];
		var f;
		//console.log(w.name+" "+w.isactive+" "+w.canfire(targetunit)+" "+this.isTurret(w));
		if (!w.isactive) continue;
		if (w.isTurret()||this.isTurret(w)) {
		    f=this.getSubRangeString;
		} else { 
		    f=this.getPrimarySubSectorString;
		    this.isinsector=function() { return true; };
		}
		for (var k=0; k<p.length; k++) {
		    this.targeting=p[k].targeting;
		    this.focus=p[k].focus+ff;
		    //console.log(w.name+" in range of "+i+"->"+w.getrange(targetunit));
		    if (w.getrange(targetunit)==0) continue;
		    this.resolveattack(w,targetunit);
		    var a=this.getattackstrength(j,targetunit);
		    var defense=targetunit.getagility();
		    power[h++]={f:f,proba:tohitproba({focus:p[k].focus+this.focus,reroll:p[k].reroll},{},{},ATTACK[a],DEFENSE[defense],a,defense),m:p[k],range:i};
/*		     s.path(f.call(this,i-1,i,p[k])).attr({fill:c,opacity:1,pointerEvents:"none"});*/
		    targetunit.cleanupattack();
		}
		if (typeof w.subauxiliary!="undefined") {
		    var f=w.subauxiliary;
		    this.isinsector=function() { return false;};
		    for (var k=0; k<p.length; k++) {
			this.resolveattack(w,targetunit);
			var a=this.getattackstrength(j,targetunit);
			var defense=targetunit.getagility();
			power[h++]={f:f,proba:tohitproba({focus:p[k].focus+this.focus,reroll:p[k].reroll},{},{},ATTACK[a],DEFENSE[defense],a,defense),m:p[k],range:i};
			targetunit.cleanupattack();
		    }
		}
	    }
	}
	power.sort(function(a,b) {
	    var d=(a.proba.tohit-b.proba.tohit);
	    if (d>0) return 1;
	    if (d<0) return -1;
	    return 0;
	});
	for (h=0; h<power.length; h++) {
	    var pw=power[h];
	    var margin=50;
	    var ll=100;
	    if (pw.proba.tohit<50) margin=pw.proba.tohit/2+25;
	    if (pw.proba.tohit>80) ll=100-(pw.proba.tohit-80);
	    
	    var hh=1.2*(100-pw.proba.tohit);
	    color="hsl("+Math.round(hh)+","+ll+","+margin+")";
	    //if (hh<60) color="rgb(255,"+Math.round(hh/60*255)+",0)";
	    //else color="rgb("+Math.round((120-hh)/60*255)+",255,0)";
	    pw.parent=this;
	    var p=s.path(pw.f.call(this,pw.range-1,pw.range,pw.m)).hover(function(event) {
		$(".info").show(); 
		var mm=this.m.move;
		var speed=P[mm].speed;
		var dir=P[mm].key;
		this.parent.setinfo((this.proba.tohit)+"%<br/>"
				    +speed+"<span class='symbols'>"+dir+"</span>"
				    +(this.m.focus?"+%FOCUS%":"")
				    +(this.m.BOOST?"+%BOOST%":"")
				    +(this.m.ROLL?"+%ROLL%":"")
				    +(this.m.targeting.length>0?"+%TARGET%":"")
				    ,event);
	    }.bind(pw),function() { 
		$(".info").hide();
	    }.bind(this)).attr({fill:color});
	}
	return false;
    }
};
var IACOMPUTING=0;

function IAUnit() {
};
IAUnit.prototype = {
    /* TODO: getmaneuverlist instead of getdial */
    IAinit:function() {
	// create environment
	this.init={
	    shield:this.shield,
	    hull:this.hull,
	    m:this.m
	};
    },
	/*
	 if (this.team==1) return;
	     this.env = {};
	     this.env.getNumStates = function() { return OBSTACLES.length*2+squadron.length*3; }
	     this.env.getMaxNumActions = function() { return this.getdial().length; }.bind(this);
	     
	// create the agent, yay!
	     this.spec={ update : 'qlearn', // qlearn | sarsa
	     gamma : 0.9, // discount factor, [0, 1)
	     epsilon : 0.2, // initial epsilon for epsilon-greedy policy, [0, 1)
	     alpha : 0.01, // value function learning rate
	     experience_add_every : 10, // number of time steps before we add another experience to replay memory
	     experience_size : 5000, // size of experience replay memory
	     learning_steps_per_iteration : 20,
	     tderror_clamp : 1.0, // for robustness
	     num_hidden_units : 100 // number of neurons in hidden layer
	     }
	     this.agent = new RL.DQNAgent(this.env, this.spec); 
	     var self=this;
	     this.wrap_before("applydamage",this,function(n) {
	     console.log("reward -"+n);
	     this.reward-=n;
	     });
	this.wrap_before("applycritical",this,function(n) {
	     console.log("reward -"+n);
	     this.reward-=n;
	     });
	     this.wrap_after("hashit",this,function(t,b) {
	     if (b) {
	     this.reward+=this.hitresolved*2+this.criticalresolved*4;
	     console.log("reward +"+(this.hitresolved*2+this.criticalresolved*4));
	     }
	     return b;
	});
	     this.wrap_before("endround",this,function(c,h,t) {
	     console.log("learn: "+this.reward);
	     this.agent.learn(this.reward);
	     });
	*/
    confirm(a) { return true;},
    guessevades(roll,promise) {
	if (this.rand(roll.dice+1)==FE_evade(roll.roll)) {
	    this.log("guessed correctly the number of evades ! +1 %EVADE% [%0]",self.name);
	    roll.roll+=FE_EVADE;
	    roll.dice+=1;
	}
	promise.resolve(roll);
    },
    findpositions(gd) {
	var q=[],c,j,i;
	// Find all possible moves, with no collision and with units in range 
	var COLOR=[GREEN,WHITE,YELLOW,RED];
	//log("find positions with color "+c);
	for (i=0; i<gd.length; i++) {
	    var d=gd[i];
	    if (d.color==BLACK) continue;
	    var mm=this.getpathmatrix(this.m,gd[i].move);
	    var n=24-8*COLOR.indexOf(d.color);
	    if (d.color==RED) n-=20;
	    if (d.color==BLACK) n=-100;
	    var n0=n;
	    var oldm=this.m;
	    this.m=mm;
	    var ep=this.evaluateposition();
	    n+=ep.self-ep.enemy-ep.dist;
	    if (d.difficulty=="RED") n=n-1.5;
	    //this.log(d.move+" "+d.color+" "+n);
	    this.m=oldm;
	    //this.log(d.move+":"+n+"/"+n0+" "+d.color);
	    q.push({n:n,m:i});
	}
	return q;
    },
    findallpositions(gd) {
	var i,j,n=0,q=[];
	var COLOR=[GREEN,WHITE,YELLOW,RED];

	for (j=0;j<gd.length; j++) {
	    var d=gd[j];
	    n=0;
	    if (d.color==BLACK) continue;
	    n=24-8*COLOR.indexOf(d.color);
	    if (d.color==WHITE) n+=8;
	    if (d.color==RED) n-=20;
	    if (d.color==BLACK) n=-100;
	    if (d.difficulty=="RED") n=n-1.5;
	    var nn=0;
	    var nnn=0;
	    n=n*this.squad.length;
	    for (i=0; i<this.squad.length; i++) {
		var u=this.squad[i];
		var mm=u.getpathmatrix(u.m,gd[j].move);
		var oldm=u.m;
		u.m=mm;
		var ep=u.evaluateposition();
		n+=ep.self-2*ep.enemy-ep.dist;
		nn+=ep.dist;
		nnn+=ep.self-ep.enemy;
		u.m=oldm;
	    }
	    //console.log(gd[j].move+"->"+n+" "+d.color+" dist:"+nn+" "+nnn);
	    q.push({n:n,m:j});
	}
	return q;
    },
    computeallmaneuvers() {
	var i,j,k,d=0;
	var q=[],possible=-1;
	var COLOR=[GREEN,WHITE,YELLOW,RED,BLACK];
	var gd=this.getdial();
	var s=this.getskill();
	for (i in squadron) {
	    var u=squadron[i];
	    var us=u.getskill();
	    u.oldm=u.m;
	    if (us<s) {
		if (u.team!=this.team) {
		    if (u.meanmround!=round) u.evaluatemoves(false,false);
		    u.m=u.meanm;
		} else {
		    //Be safe
		    if (typeof u.futurem=="undefined") u.futurem=u.m;
		    u.m=u.futurem;
		}
	    }
	}
	this.evaluategroupmoves();
	console.log("captaingd "+this.captaingd.length);
	q=this.findallpositions(this.captaingd);
	k=0;
	// Restore position
	for (i in squadron) squadron[i].m=squadron[i].oldm;
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    var mm=this.captaingd[q[0].m].idx;
	    var move=this.captaingd[q[0].m].move;
	    for (i=0; i<mm.length; i++) {
		u=this.squad[i];
		u.lastmaneuver=u.maneuver;
		u.maneuver=mm[i];
		u.futurem=u.getpathmatrix(u.m,move);
	    }
	    nextplanning();
	} else {
	    console.log("(q=vide) UNDEFINED GD FOR "+this.name);
	}
	this.log("Group maneuver set");//+":"+d+"/"+q.length+" possible?"+possible+"->"+gd[d].move);
    },
    computemaneuver() {
	var i,j,k,d=0;
	var q=[],possible=-1;
	/*if (this.team==2) {
	    var mm=this.m.split();
	    var s=[mm.dx,mm.dy,mm.rotate];
	    for (i in squadron) {
		if (squadron[i]==this) continue;
		var m=squadron[i].m;
		var mm=m.split();
		s.push(mm.dx);
		s.push(mm.dy);
		s.push(mm.rotate);
	    }
	    for (i=0; i<OBSTACLES.length; i++) {
		s.push(OBSTACLES[i].x);
		s.push(OBSTACLES[i].y);
	    }
	    this.reward=0;
	    var action = this.agent.act(s); // s is an array of length 15
	    console.log("action chosen: "+action);
	    return action;
	 } */	
	var COLOR=[GREEN,WHITE,YELLOW,RED,BLACK];
	var gd=this.getdial();
	//var enemies=[];
	var s=this.getskill();
	for (i in squadron) {
	    var u=squadron[i];
	    var us=u.getskill();
	    u.oldm=u.m;
	    //console.log("setting oldm");
	    if (us<s) {
		if (u.team!=this.team) {
		    if (u.meanmround!=round) u.evaluatemoves(false,false);
		    u.m=u.meanm;
		} else {
		    //Be safe
		    if (typeof u.futurem=="undefined") u.futurem=u.m;
		    u.m=u.futurem;
		}
	    }
	}

	this.evaluatemoves(true,true);
	q=this.findpositions(gd);
	//console.log(this.name+"end evaluates move");
	//log("computing all enemy positions");
	// Find all possible future positions of enemies
	k=0;
	/*for (i in squadron) {
	    var u=squadron[i];
	    if (u.team!=this.team) {
		if (u.meanmround!=round) u.evaluatemoves(false,false);
		u.oldm=u.m;
		u.m=u.meanm;
		enemies.push(u);
	    }
	}*/
	// Restore position
	for (i in squadron) squadron[i].m=squadron[i].oldm;
	if (q.length>0) {
	    q.sort(function(a,b) { return b.n-a.n; });
	    //for (i=0; i<q.length; i++) this.log(">"+q[i].n+" "+gd[q[i].m].move);
	    d=q[0].m;
	    //if (typeof gd[d] == "undefined") log("GD NON DEFINI POUR "+this.name+" "+gd.length+" "+d);	    
	} else {
	    for (i=0; i<gd.length; i++) 
		if (gd[i].difficulty!="RED"||gd[i].move.match(/F\d/)) break;
	    d=i;
	    //if (typeof gd[d] == "undefined") log("(q=vide) UNDEFINED GD FOR "+this.name+" "+gd.length+" "+possible);

	}
	this.futurem=this.getpathmatrix(this.m,gd[d].move);
	this.log("Maneuver set");//+":"+d+"/"+q.length+" possible?"+possible+"->"+gd[d].move);
	return d;
    },
    resolveactionselection(units,cleanup) {
	cleanup(0);
    },
    selectcritical(crits,endselect) {
	for (var i=0; i<crits.length; i++) {
	    if (CRITICAL_DECK[crits[i]].lethal==false) {
		endselect(crits[i]); return;
	    }
	}
	endselect(crits[0]);
    },
    resolveactionmove(moves,cleanup,automove,possible,scoring) {
	var i;
	var ready=false;
	var score=-1000;
	var scorei=-1;
	var old=this.m;
	for (i=0; i<moves.length; i++) {
	    var c=this.getmovecolor(moves[i],true,true);
	    if (c==GREEN) {
		var e;
		ready=true;
		if (typeof scoring=="array") e=scoring[i];  
		else {
		    this.m=moves[i];
		    var ep=this.evaluateposition();
		    e=ep.self-ep.enemy-ep.dist;
		    //e=this.evaluateposition();
		}
		if (score<e) { score=e; scorei=i; }
	    }
	}
	this.m=old;
	if (ready&&scorei>-1) { 
	    if (automove) {
		var gpm=moves[scorei].split();
		var tpm=this.m.split();
		s.path("M "+tpm.dx+" "+tpm.dy+" L "+gpm.dx+" "+gpm.dy).appendTo(VIEWPORT).attr({stroke:this.color,display:TRACE?"block":"none",strokeWidth:"20px",strokeLinecap:"round",strokeDasharray:"1, 30",opacity:0.2,fill:"rgba(0,0,0,0)"}).addClass("trace");
		this.show();

	    	this.m=moves[scorei]; 
		gpm=this.m.split();
		this.movelog("am-"+Math.floor(300+gpm.dx)+"-"+Math.floor(300+gpm.dy)+"-"+Math.floor((360+Math.floor(gpm.rotate))%360));
	    }
	    var mine=this.getmcollisions(this.m);
	    if (mine.length>0) 
		for (i=0; i<mine.length; i++) {
		    if (typeof OBSTACLES[mine[i]].detonate=="function") 
			OBSTACLES[mine[i]].detonate(this)
		    else {
			this.log("colliding with obstacle");
			this.resolveocollision(1,[]);
		    }
		}
	    cleanup(this,scorei); 
	}
	else { this.m=old; cleanup(this,-1); }
    },
    doplan() {
	$("#move").css({display:"none"});
	$("#maneuverdial").empty();
	if (TEAMS[this.team].captain==null) {
	    // Elect a captain
	    this.electcaptain();
	}
	/*if (this.group==-1) {
	    this.group=TEAMS[this.team].groups++;
	    p=this.selectnearbyally(1,function(s,t) {
		if (s.group>-1||s.group<t.group) t.group=s.group;
	    });
	}*/
	if (this==this.captain) {
	    console.log("captain for team "+this.team+" is:"+this.name);
	    console.log("surrounded by "+this.selectnearbyally(3).length+" units");
	    this.computeallmaneuvers();
 	} else {
	    if (this.maneuver==-1) this.maneuver=0;
	    nextplanning();
	}
	/* Not for captain management.
	if (phase==PLANNING_PHASE&&this.maneuver==-1) {
	    IACOMPUTING++;
	    if  (IACOMPUTING==1) {
		$("#npimg").hide();
		$("#npimgwait").show();
	    }
	    var p;
	    p=setInterval(function() {
		var m=this.computemaneuver(); 
		IACOMPUTING--;
		if (IACOMPUTING==0) {
		    $("#npimg").show();
		    $("#npimgwait").hide();
		}
		this.newm=this.getpathmatrix(this.m,this.getdial()[m].move);
		this.setmaneuver(m);
		clearInterval(p);
	    }.bind(this),0);
	} else { 
	    if (this.maneuver==-1) this.maneuver=0;
	    nextplanning();
	}*/
	return this.deferred;
    },
    showdial() { 	
	$("#maneuverdial").empty();
	if (phase>=PLANNING_PHASE) {
	    if (this.maneuver==-1||this.hasmoved) {
		this.clearmaneuver();
		return;
	    };
	}
    },
    resolvedecloak() {
	var p=this.getdecloakmatrix(this.m);
	var move=this.getdial()[this.maneuver].move;
	var scoring=[];
	var old=this.m;
	for (var i=0; i<p.length; i++) {
	    this.m=this.getpathmatrix(p[i],move);
	    var ep=this.evaluateposition();
	    scoring[i]=ep.self-ep.enemy-ep.dist;
	}
	this.m=old;
	this.resolveactionmove(p,
			       function(t,k) {
				   if (k>0) {
				       this.removecloaktoken();
				       t.show();
				   }
				   this.hasdecloaked=true;
			       }.bind(this),true,scoring);
    },
    showactivation() {
    },
    timetoshowmaneuver() {
	return this.maneuver>-1&&skillturn>=this.getskill()&&phase==ACTIVATION_PHASE&&subphase==ACTIVATION_PHASE;
    },
    doactivation() {
	var ad=this.updateactivationdial();
	if (this.timeformaneuver()) {
	    //this.log("resolvemaneuver");
	    this.resolvemaneuver();
	} //else this.log("no resolvemaneuver");
    },
    showaction() {
	$("#actiondial").empty();
	if (this.action>-1&&this.action<this.actionList.length) {
	    var a = this.actionList[this.action];
	    var c=A[a].color;
	    this.actionicon.attr({fill:((this==activeunit)?c:halftone(c))});
	} else this.actionicon.attr({text:""});	
    },
    donoaction(list,str) {
	var cmp=function(a,b) {
	    if (a.type=="CRITICAL") return -1;
	    if (b.type=="CRITICAL") return 1;
	    if (a.type=="EVADE") return -1;
	    if (b.type=="EVADE") return 1;
	    if (a.type=="FOCUS") return -1;
	    if (b.type=="FOCUS") return 1;
	    return 0;
	};
	list.sort(cmp);
	return this.enqueueaction(function(n) {
		this.select();
		if (typeof str!="undefined"&&str!="") this.log(str);
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="EVADE"&&this.candoevade()) {
			var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { a=list[i]; break; }
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		this.resolvenoaction(a,n);
	    }.bind(this),"donoaction ia");
    },
    doaction(list,str,cando) {
	var i;
	var cmp=function(a,b) { return b.priority-a.priority; };
	if (typeof cando=="undefined") cando=this.candoaction;

	for (i=0; i<list.length; i++) {
	    this.setpriority(list[i]);
	}
	list.sort(cmp);
	if (list.length==0) return this.enqueueaction(function(n) {
	    this.endnoaction(n);
	}.bind(this));
	return this.enqueueaction(function(n) {
	    var i;
	    if (cando.call(this)) {
		this.select();
		if (typeof str!="undefined"&&str!="") this.log(str);
		var a=null;
		for (i=0; i<list.length; i++) {
		    if (list[i].type=="CRITICAL") { a=list[i]; break; }
		    else if (list[i].type=="CLOAK"&&this.candocloak()) {
			a=list[i]; break;
		    } else if (list[i].type=="EVADE"&&this.candoevade()) {
			/*var noone=true;
			var grlu=this.getenemiesinrange();
			for (i=0; i<grlu.length; i++) 
			    if (grlu[i].length>0) { noone=false; break; }
			if (noone) { */
			    a=list[i]; break; //}
		    } else if (list[i].type=="FOCUS") {
			if (this.candofocus()) { a=list[i]; break; }
		    } else { a = list[i]; break }
		}
		/*if (a==null) this.log("no possible action");
		if (a!=null) this.log("action chosen: "+a.type);
		else this.log("null action chosen");*/
		this.resolveaction(a,n);
	    } else {
		this.endaction(n);
	    }
	}.bind(this),"doaction ia");
    },
    showattack() {
	//$("#attackdial").empty();
    },
    doattack(weaponlist,enemies) {
	//this.log("ia/attack?"+this.id+" forced:"+forced+" turn:"+(skillturn==this.skill));
	var power=0,t=null;
	var i,w;
	//this.log(this.id+" readytofire?"+this.canfire());
	NOLOG=true;
	if (typeof weaponlist=="undefined") weaponlist=this.weapons;

	var r=this.getenemiesinrange(weaponlist,enemies);
	for (w=0; w<weaponlist.length; w++) {
	    var el=r[w];
	    var wp=this.weapons.indexOf(weaponlist[w]);
	    for (i=0;i<el.length; i++) {
		var p=this.evaluatetohit(wp,el[i]).tohit;
		//this.log("power "+p+" "+el[i].name);
		if (p>power&&!el[i].isdocked) {
		    t=el[i]; power=p; this.activeweapon=wp; 
		}
	    }
	}
	NOLOG=false;
	//this.log("ia/wn:"+this.activeweapon+" "+power);
	//if (t!=null) this.log("ia/doattack "+this.id+":"+this.weapons[this.activeweapon].name+" "+t.name);
      	if (t!=null) return this.selecttargetforattack(this.activeweapon,[t]);
	//this.log("ia/doattack:canfire but no target");
	//this.log("ia/doattack "+this.id+":cannot fire");
	this.addhasfired(); 
	this.cleanupattack();
	//this.log("noattack");
	return false;
    },
    getresultmodifiers(m,n,from,to) {
	var mods=this.getdicemodifiers(); 
	var lm=[];
	var mm;
	NOLOG=false;
	for (var i=0; i<mods.length; i++) {
	    var d=mods[i];
	    if (d.from==from&&d.to==to) {
		if (d.type==MOD_M&&d.req(m,n)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) 
			modroll(d.f,i,to);
		} if (d.type==ADD_M&&d.req(m,n)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) 
			addroll(d.f,i,to);
		} if (d.type==REROLL_M&&d.req(activeunit,activeunit.weapons[activeunit.activeweapon],targetunit)) {
		    if (typeof d.aiactivate!="function"||d.aiactivate(m,n)==true) {
			if (typeof d.f=="function") d.f();
			reroll(n,from,to,d,i);
		    }
		}
	    }
	}
	return lm;	
    }
};
(function() {
    var sabine_fct=function() {
    var p=[];
    if (this.hasionizationeffect()) return;
    if (this.candoaction()) {
	if (this.candoboost()) 
	    p.push(this.newaction(this.resolveboost,"BOOST"));
	if (this.candoroll()) 
	    p.push(this.newaction(this.resolveroll,"ROLL"));
	this.doaction(p,"free %BOOST% or %ROLL% action");
    }
}
var zeb_fct = function(r,t) {
    // first, cancel criticals
    this.log("cancel %CRIT% first");
    r=this.cancelcritical(r,t);
    r=Unit.prototype.cancelhit(r,t);
    return r;
}
var maarek_fct = function() {
    var unit=this;
    var newdeal=function(c,f,p) {
	var pp=$.Deferred();
	p.then(function(cf) {
	    var crit=cf.crit;
	    if (cf.face==FACEUP&&activeunit==unit&&targetunit==this) {
		var s1=this.selectdamage();
		CRITICAL_DECK[s1].count--;
		var s2=this.selectdamage();
		CRITICAL_DECK[s2].count--;
		var s3=this.selectdamage();
		CRITICAL_DECK[s3].count--;
		sc=[s1,s2,s3];
		unit.log("select one critical");
		unit.selectcritical(sc,function(m) { 
		    pp.resolve({crit:new Critical(this,m),face:FACEUP})
		}.bind(this));
	    } else pp.resolve(cf);
	}.bind(this));
	return pp.promise();
    };
    Unit.prototype.wrap_after("deal",this,newdeal);
};
var poe_fct=function() {
    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	req:function(m,n) { 
	    return this.focus>0;
	}.bind(this),
	aiactivate: function(m,n) {
	    return FCH_focus(m)>0;
	},
	f:function(m,n) {
	    var f=FCH_focus(m);
	    if (f>0) {
		this.log("1 %FOCUS% -> 1 %HIT%");
		return m-FCH_FOCUS+FCH_HIT;
	    }
	    return m;
	}.bind(this),str:"focus"});
    this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
	req:function(m,n) { 
	    return this.focus>0;
	}.bind(this),
	aiactivate: function(m,n) {
	    return FE_focus(m)>0;
	},
	f:function(m,n) {
	    var f=FE_focus(m);
	    if (f>0) {
		this.log("1 %FOCUS% -> 1 %EVADE%");
		return m-FE_FOCUS+FE_EVADE;
	    }
	    return m;
	}.bind(this), str:"focus"});
}
var hera_fct=function(p) {
    var m;
    var gd=this.getdial();
    for (var i in p) {
	m=p[i];
	if ((m.difficulty=="RED"||m.difficulty=="GREEN")&&!this.hasionizationeffect()) {
	    for (var i=0; i<gd.length; i++) 
		if (gd[i].difficulty==m.difficulty) p[gd[i].move]=gd[i];
	}
    }
    return p;
}
window.PILOTS = [
    {
	name:"Contracted Scout",
	faction:SCUM,
	pilotid:0,
	done:true,
	unit:"JumpMaster 5000",
	skill:3,
	points:25,
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    {
        name: "Wedge Antilles",    
	done:true,
        unique: true,
	faction:REBEL,
        unit: "X-Wing",
        skill: 9,
	init: function() {
	    this.wrap_before("resolveattack",this,function(w,target) {
		target.log("-1 defense [%0]",this.name);
		console.log("wedge in effect for "+target.name);
		target.wrap_after("getagility",this,function(a) {
		    console.log(this.name+" agility is "+(a-1));
		    return (a>0)?a-1:a; 
		}).unwrapper("cleanupattack");
		target.showstats();
	    });
	},
	pilotid:1,
        points: 29,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Garven Dreis",
	done:true,
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
	init: function() {
	    this.wrap_after("removefocustoken",this,function() {
		this.selectunit(this.selectnearbyally(2),function (p,k) { 
		    p[k].log("+1 %FOCUS%");
		    p[k].addfocustoken();
		}.bind(this),["select unit for free %FOCUS%"],false);
	    });
	},
	pilotid:2,
        skill: 6,
        points: 26,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Red Squadron Pilot",
	done:true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 4,
        points: 23,
	pilotid:3,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Rookie Pilot",
	done:true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 2,
        points: 21,
	pilotid:4,
        upgrades: [TORPEDO,ASTROMECH],
    },
    { name:"Turbolaser",
      done:true,
      unit:"Turbolaser",
      faction:EMPIRE,
      skill:0,
      points:4,
      pilotid:5,
      upgrades:[MISSILE,MISSILE,TORPEDO,TORPEDO,TURRET],
    },
    { name:"Thermal Exhaust Port",
      done:true,
      unit:"Exhaust Port",
      faction:EMPIRE,
      skill:0,
      points:100,
      pilotid:6,
      upgrades:[],
    },
    {
        name: "Biggs Darklighter",
	done:true,
	pilotid:7,
        init: function() {
	    var biggs=this;
	    Weapon.prototype.wrap_after("getenemiesinrange",this,function(enemylist,r) {
		if (typeof r=="undefined") {
		    r=enemylist;
		    enemylist=this.unit.selectnearbyenemy(3);
		}
		if (this.unit.foundbiggs==true) {
		    var p=[];
		    for (var i=0; i<r.length; i++) {
			var u=r[i];
			if (u==biggs||u.getrange(biggs)>1) p.push(u);
		    }
		    r=p;
		}
		return r;
	    });
	    Unit.prototype.wrap_after("getenemiesinrange",this,function(weaponlist,enemies,r) {

		this.foundbiggs=false;
		var p=[];
		for (var i=0; i<weaponlist.length; i++) {
		    if (r[i].indexOf(biggs)>-1) { this.foundbiggs=true; break; }
		}
		if (this.foundbiggs) {
		    for (var i=0; i<weaponlist.length; i++) {
			p[i]=[];
			for (var j=0; j<r[i].length; j++) {
			    var u=r[i][j];
			    if (u==biggs||u.getrange(biggs)>1) {
				p[i].push(u);
			    }
			}
		    }
		} else p=r;
		return p;
	    });
	},
        unique: true,
        unit: "X-Wing",
	faction:REBEL,
        skill: 5,
        points: 25,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Luke Skywalker",
	done:true,
	pilotid:8,
	faction:REBEL,
	init: function() {
	    this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req: function(m,n) { return true; },
		aiactivate:function(m,n) { 
		    return FE_focus(m)>0;
		},
		f:function(m,n) {
		    if (FE_focus(m)>0) {
			this.log("1 %FOCUS% -> 1 %EVADE%");
			m=m-FE_FOCUS+FE_EVADE;
		    } 
		    return m;
		}.bind(this),
		str:"focus"});
	},        
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 28,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Gray Squadron Pilot",
	done:true,
	faction:REBEL,
        unit: "Y-Wing",
        skill: 4,
	pilotid:9,
        points: 20,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "'Dutch' Vander",
	done:true,
	pilotid:10,
	init: function() {
            this.wrap_after("addtarget",this,function(t) {
		this.selectunit(this.selectnearbyally(2),function(p,k) {
		    p[k].selectunit(p[k].gettargetableunits(3),function(pp,kk) {
			if (this.gettargetableunits(3).indexOf(pp[kk])>-1) 
			    this.addtarget(pp[kk]);
		    },["select target to lock"],false);
		},["select unit for free %TARGET% (or self to cancel)"],true);
	    });
	},
	faction:REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 6,
        points: 23,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Horton Salm",
	done:true,
	pilotid:11,
	faction:REBEL,
        unique: true,
        unit: "Y-Wing",
        skill: 8,
        points: 25,
	init: function() {
	    unit=this;
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank"],
		n:function() { return 9; },
		req:function(attack,w,defender) {
		    var r=this.getrange(defender);
		    if (r>=2&&r<=3) {
			this.log("reroll any blank result");
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Gold Squadron Pilot",
	done:true,
	pilotid:12,
        unit: "Y-Wing",
	faction:REBEL,
        skill: 2,
        points: 18,
        upgrades: [TURRET,TORPEDO,TORPEDO,ASTROMECH],
    },
    {
        name: "Academy Pilot",
	done:true,
	pilotid:13,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 1,
        points: 12,
        upgrades: [],
    },
    {
        name: "Obsidian Squadron Pilot",
	done:true,
	pilotid:14,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 3,
        points: 13,
        upgrades: [],
    },
    {
        name: "Black Squadron Pilot",
	done:true,
	pilotid:15,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 4,
        points: 14,
        upgrades: [ELITE],
    },
    {
        name: "'Scourge'",
	unique:true,
	beta:true,
	done:true,
	pilotid:16,
        unit: "TIE Fighter",
        faction:EMPIRE,
        skill: 7,
	wave:["epic"],
        points: 17,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(i,sh,gas) {
		if (sh.criticals.length>0) {
		    this.log("+1 attack die for attacking damaged unit");
		    return gas+1;
		}
		return gas;
	    })
	},
        upgrades: [ELITE],
    },
    {
        name: "'Winged Gundark'",
        faction:EMPIRE,
	pilotid:17,
        init:  function() {
	    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return (this.getrange(targetunit)==1);
		}.bind(this),
		aiactivate: function(m,n) {
		    return FCH_hit(m)>0;
		},
		f:function(m,n) {
		    if (FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT%");
			m= m-FCH_HIT+FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"hit"});
	},        
	done:true,
        unique: true,
        unit: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: "'Night Beast'",
        faction:EMPIRE,
	done:true,
	pilotid:18,
	init: function() {
	    this.wrap_after("handledifficulty",this,function(difficulty) {
		if (difficulty=="GREEN"&&this.candofocus()&&this.candoaction()) 
		    this.doaction([this.newaction(this.addfocus,"FOCUS")],
				  "green maneuver -> free focus action");
	    })
	},
        unique: true,
        unit: "TIE Fighter",
        skill: 5,
        points: 15,
        upgrades: [ ],
    },
    {
        name: "'Backstabber'",
        unique: true,
	done:true,
	pilotid:19,
        faction:EMPIRE,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (!sh.isinfiringarc(this)) {
		    a=a+1;
		    this.log("+1 attack against %0",sh.name);
		}
		return a;
	    });
	},
        unit: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Dark Curse'",
	done:true,
	pilotid:20,
        faction:EMPIRE,
        unique: true,
	init: function() {
	    var self=this;
	    this.wrap_after("isattackedby",this,function(w,a) {
		a.wrap_after("canusefocus",self,function() { return false; }).unwrapper("afterdefenseeffect");
		a.wrap_after("canusetarget",self,function(t) { return false; }).unwrapper("afterdefenseeffect");
		a.wrap_after("getdicemodifiers",self,function(mods) {
		    var p=[];
		    for (var i=0; i<mods.length; i++)
			if (mods[i].type!=REROLL_M) p.push(mods[i]);
		    return p;
		}).unwrapper("afterdefenseeffect");
	    })
	},
        unit: "TIE Fighter",
        skill: 6,
        points: 16,
        upgrades: [ ],
    },
    {
        name: "'Mauler Mithel'",
        faction:EMPIRE,
	done:true,
	pilotid:21,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.gethitrange(w,sh)==1) { 
		    this.log("+1 attack against %0",sh.name);
		    a=a+1;
		}
		return a;
	    });
	},
        unique: true,
        unit: "TIE Fighter",
        skill: 7,
        points: 17,
        upgrades: [ELITE],
    },
    {
        name: "'Howlrunner'",
        unique: true,
	done:true,
	pilotid:22,
        faction:EMPIRE,
        unit: "TIE Fighter",
        skill: 8,
	init: function() {
	    Unit.prototype.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    // Howlrunner dead ? 
		    if (attacker!=this&&!this.dead
			&&attacker.getrange(this)==1
			&&attacker.isally(this)&&w.isprimary) {
			attacker.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        points: 18,
        upgrades: [ELITE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	pilotid:23,
	ambiguous:true,
        faction:EMPIRE,
	edition:"TIE Advanced",
	unit: "TIE Advanced",
        skill: 7,
        points: 27,
	init: maarek_fct,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Maarek Stele",
        unique: true,
	done:true,
	pilotid:24,
	ambiguous:true,
	edition:"TIE Defender",
        faction:EMPIRE,
	unit: "TIE Defender",
        skill: 7,
        points: 35,
	init: maarek_fct,
	shipimg:"tie-defender-red.png",
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Tempest Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:25,
        unit: "TIE Advanced",
        skill: 2,
        points: 21,
        upgrades: [MISSILE],
    },
    {
        name: "Storm Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:26,
        unit: "TIE Advanced",
        skill: 4,
        points: 23,
        upgrades: [MISSILE],
    },
    {
        name: "Darth Vader",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:27,
        unit: "TIE Advanced",
        skill: 9,
	init: function() {
	    this.wrap_before("doendmaneuveraction",this,function() {
		this.log("+1 action [%0]",this.name);
		this.doaction(this.getactionlist(),"",this.candoendmaneuveraction);
	    });
	},
	secaction:-1,
        points: 29,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Alpha Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:28,
        unit: "TIE Interceptor",
        skill: 1,
        points: 18,
        upgrades: [ ],
    },
    {
        name: "Avenger Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:29,
        unit: "TIE Interceptor",
        skill: 3,
        points: 20,
        upgrades: [ ],
    },
    {
        name: "Saber Squadron Pilot",
        faction:EMPIRE,
	done:true,
	pilotid:30,
        unit: "TIE Interceptor",
        skill: 4,
        points: 21,
	wave:["aces",2],
        upgrades: ["Elite"],
    },
    {
        name: "'Fel's Wrath'",
        faction:EMPIRE,
        unique: true,
        unit: "TIE Interceptor",
	skill: 5,
	pilotid:31,
	done:true,
	init: function() {
	    this.wrap_after("endcombatphase",this,function() {
		this.hasfired=0;
		this.checkdead();
	    });
	    this.wrap_after("canbedestroyed",this,function(skillturn,b) {
		return (skillturn==-1);
	    });
	},
        points: 23,
        upgrades: [],
    },
    {
        name: "Turr Phennir",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:32,
        unit: "TIE Interceptor",
        skill: 7,
	init: function() {
	    this.addafterattackeffect(this,function() {
		var p=[];/*TODO: should not test before performing the action */
		if (this.candoboost()) 
		    p.push(this.newaction(this.resolveboost,"BOOST"));
		if (this.candoroll()) 
		    p.push(this.newaction(this.resolveroll,"ROLL"))
		this.doaction(p,"free %BOOST% or %ROLL% action");
	    });
	},
        points: 25,
        upgrades: [ELITE],
    },
    {
        name: "Soontir Fel",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:33,
	init: function() {
	    this.wrap_after("addstress",this,function () {
		this.log("+1 %STRESS% -> +1 %FOCUS%");
		this.addfocustoken();
	    });
	},
        unit: "TIE Interceptor",
        skill: 9,
        points: 27,
        upgrades: [ELITE],
    },
    {
        name: "Tycho Celchu",
	faction:REBEL,
        unique: true,
	pilotid:34,
	done:true,
	init: function() {
	    this.wrap_after("hasnostresseffect",this,function() {
		return true;
	    });
	},
        unit: "A-Wing",
        skill: 8,
        points: 26,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Arvel Crynyd",
	faction:REBEL,
	pilotid:35,
        unique: true,
	done:true,
        unit: "A-Wing",
	init: function() {
	    this.wrap_after("checkcollision",this,function(sh) {
		return false;
	    });
	},
        skill: 6,
        points: 23,
        upgrades: [MISSILE],
    },
    {
        name: "Green Squadron Pilot",
	faction:REBEL,
	done:true,
	wave:["aces",2],
        unit: "A-Wing",
        skill: 3,
	pilotid:36,
        points: 19,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Prototype Pilot",
	faction:REBEL,
	done:true,
	pilotid:37,
	wave:["aces",2],
        unit: "A-Wing",
        skill: 1,
        points: 17,
        upgrades: [MISSILE],
    },
    {
        name: "Outer Rim Smuggler",
	faction:REBEL,
        unit: "YT-1300",
	done:true,
	pilotid:38,
	install: function() {
	    this.hull=6;
	    this.shield=4;
	    this.weapons[0].attack=2;
	},
	uninstall: function() {
	    this.hull=8;
	    this.shield=5;
	    this.weapons[0].attack=3;
	},
        skill: 1,
        points: 27,
        upgrades: [CREW,CREW],
    },
    {
        name: "Chewbacca",
        unique: true,
	done:true,
	ambiguous:true,
	faction:REBEL,
        unit: "YT-1300",
        skill: 5,
	pilotid:39,
        points: 42,
	deal: function(c,f) {
	    var p=$.Deferred();
	    if (f==FACEUP) {
		this.log("turn faceup damage facedown");
		return p.resolve({crit:c,face:FACEDOWN}).promise();
	    } else return p.resolve({crit:c,face:f}).promise();
	},
        upgrades: [ELITE,MISSILE,CREW,CREW]
    },
    {
        name: "Lando Calrissian",
	faction:REBEL,
        unique: true,
        unit: "YT-1300",
        skill: 7,
	pilotid:40,
        points: 44,
	init: function() {
	    this.wrap_after("handledifficulty",this,function(d) {
		if (d=="GREEN") {
		    this.selectunit(this.selectnearbyally(1),function(p,k) {
			p[k].log("+1 action [%0]",this.name);
			p[k].doaction(p[k].getactionbarlist(),"");
		    }.bind(this),["select unit (or self to cancel) [%0]",this.name],true);
		}
	    });
	},
	done:true,
        upgrades: [ELITE,MISSILE,CREW,CREW],
    },
    {
        name: "Han Solo",
        unique: true,
	done:true,
	faction:REBEL,
        unit: "YT-1300",
        skill: 9,
	pilotid:41,
        points: 46,
	init: function() {
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus","hit","critical"],
		n:function() { return 9; },
		req:function(attack,w,defender) { return true; },
		mustreroll:true,
	    });
	},
        upgrades: [ELITE,MISSILE,CREW,CREW],
    },
    {
        name: "Kath Scarlet",
        unique: true,
        faction:EMPIRE,
        unit: "Firespray-31",
        skill: 7,
	pilotid:42,
	done:true,
	init: function() {
	    this.wrap_before("resolveattack",this,function(w,target) {
		var self=this;
		target.wrap_after("cancelcritical",self,function(r,org,r2) {
		    if (FCH_crit(r.ch)>FCH_crit(r2.ch)) {
			this.log("+1 %STRESS% for cancelling %CRIT% [%0]",self.name);
			this.addstress();
		    }
		    return r2;
		}).unwrapper("afterdefenseeffect");
	    });
	},
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Boba Fett",
        unique: true,
	done:true,
	pilotid:43,
        faction:EMPIRE,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		if (this.hasionizationeffect()) return p;
		for (var i=1; i<=3; i++) {
		    if (typeof p["BL"+i]!="undefined") {
			this.log("select %BANKLEFT% or %BANKRIGHT% turn");
			p["BR"+i]={move:"BR"+i,difficulty:p["BL"+i].difficulty};
		    } else if (typeof p["BR"+i]!="undefined") {
			this.log("select %BANKLEFT% or %BANKRIGHT% turn");
			p["BL"+i]={move:"BL"+i,difficulty:p["BR"+i].difficulty};
		    }
		}
		return p;
	    });
	},
        unit: "Firespray-31",
        skill: 8,
        points: 39,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Krassis Trelix",
        unique: true,
	done:true,
	pilotid:44,
        faction:EMPIRE,
        unit: "Firespray-31",
	init: function() {
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attack,w,defender) {
		    if (!w.isprimary) {
			attack.log("+%1 reroll(s) [%0]",attack.name,1);
			return true;
		    }
		    return false;
		}
	    });
	},
        skill: 5,
        points: 36,
        upgrades: [CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Bounty Hunter",
        unit: "Firespray-31",
        skill: 3,
	pilotid:45,
	done:true,
        faction:EMPIRE,
        points: 33,
        upgrades: [CANNON,BOMB,CREW,MISSILE],
    },
    {
        name: "Ten Numb",
	faction:REBEL,
        unique: true,
	done:true,
	pilotid:46,
        unit: "B-Wing",
        skill: 8,
	shipimg:"b-wing-1.png",
	init: function() {
	    var self=this;
	    this.wrap_before("resolveattack",this,function(w,target) {
		target.wrap_after("cancelcritical",self,function(r,org,r2) {
		    if (FCH_crit(r.ch)>0) {
			if (FCH_crit(r2.ch)==0) {
			    target.log("cannot cancel 1 %CRIT% [%0]",this.name)
			    return {ch:r2.ch+FCH_CRIT,e:r2.e+1};
			}
			return r2;
		    } else return r2;
		}.bind(this)).unwrapper("afterdefenseeffect");
	    });
	},
        points: 31,
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Ibtisam",
        unique: true,
	done:true,
	faction:REBEL,
        unit: "B-Wing",
        skill: 6,
	pilotid:47,
        points: 28,
	shipimg:"b-wing-1.png",
	init: function() {
	    var m={
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    if (this.stress>0) {
			this.log("+%0 reroll",1);
			return true;
		    }
		    return false;
		}.bind(this)
	    };
	    this.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,m);
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,$.extend({},m));
	},
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Dagger Squadron Pilot",
        unit: "B-Wing",
	done:true,
	wave:["aces",3],
	pilotid:48,
	faction:REBEL,
        skill: 4,
        points: 24,
        upgrades: [SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Blue Squadron Pilot",
        unit: "B-Wing",
	done:true,
	wave:["aces",3],
	faction:REBEL,
        skill: 2,
	pilotid:49,
        points: 22,
        upgrades: [SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Rebel Operative",
        unit: "HWK-290",
	done:true,
	faction:REBEL,
        skill: 2,
	pilotid:50,
        points: 16,
        upgrades: [TURRET,CREW],
    },
    {
        name: "Roark Garnet",
        unique: true,
	faction:REBEL,
        unit: "HWK-290",
        skill: 4,
	pilotid:51,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		var self=this;
		this.selectunit(this.selectnearbyally(3),function(p,k) {
		    p[k].log("has PS of 12");
		    p[k].wrap_after("getskill",self,function(s) {
			return 12;
		    }).unwrapper("endcombatphase");
		},["select unit [%0]",this.name],false);
		return l;
	    });
	},     
	done:true,
        points: 19,
        upgrades: [TURRET,CREW],
    },
    {
        name: "Kyle Katarn",
	faction:REBEL,
        unique: true,
	done:true,
        unit: "HWK-290",
        skill: 6,
	pilotid:52,
        points: 21,
	init: function() {
	    var self=this;
	    this.wrap_after("begincombatphase",this,function(l) {
		if (this.canusefocus()) {
		    this.selectunit(this.selectnearbyally(3),function(p,k) {
			this.removefocustoken();
			p[k].addfocustoken();
			p[k].log("+1 %FOCUS%");
		    },["select unit for free %FOCUS% (or self to cancel)"],true);
		}
		return l;
	    });
	},
        upgrades: [ELITE,TURRET,CREW],
    },
    {
        name: "Jan Ors",
	faction:REBEL,
        unique: true,
	done:true,
	pilotid:53,
        unit: "HWK-290",
        skill: 8,
	init: function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (self.stress==0)&&(!self.dead)&&
			activeunit.isally(self)&(activeunit!=self)
			&&(self.getrange(activeunit)<=3);
		}, 
		f:function(m,n) {
		    var f=self.rollattackdie(1,self,"critical")[0];
		    self.addstress();
		    activeunit.log("+1 attack die [%0]",self.name);
		    if (f=="focus") return {m:m+FCH_FOCUS,n:n+1};
		    if (f=="hit") return {m:m+FCH_HIT,n:n+1};
		    if (f=="critical") return {m:m+FCH_CRIT,n:n+1};
		    return {m:m,n:n+1};
		},str:"hit"});
	},
        points: 25,
        upgrades: [ELITE,TURRET,CREW],
    },
    {
        name: "Scimitar Squadron Pilot",
        done:true,
        unit: "TIE Bomber",
        skill: 2,
	pilotid:54,
        faction:EMPIRE,
        points: 16,
        upgrades: [TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Gamma Squadron Pilot",
	done:true,
	pilotid:55,
        unit: "TIE Bomber",
        faction:EMPIRE,
        skill: 4,
        points: 18,
        upgrades: [TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Captain Jonus",
        faction:EMPIRE,
	done:true,
	pilotid:56,
        init: function() {
	    Unit.prototype.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    // Jonus dead ? 
		    if (attacker!=this&&!this.dead
			&&attacker.getrange(this)==1
			&&attacker.isally(this)
			&&w.isprimary!=true) {
			attacker.log("+%1 reroll(s) [%0]",this.name,2);
			return true;
		    }
		    return false;
		}.bind(this)});
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 6,
        points: 22,
        upgrades: [ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Major Rhymer",
	done:true,
	pilotid:57,
        faction:EMPIRE,
        init: function() {
	    for (var i=0; i<this.weapons.length; i++) {
		this.weapons[i].wrap_after("getlowrange",this,function(n) {
		    if (n>1) n= n-1;
		    return n;
		});
		this.weapons[i].wrap_after("gethighrange",this,function(n) {
		    if (n<3) n=n+1;
		    return n;
		});
	    }
	    this.log("extending weapon ranges");
	},
        unique: true,
        unit: "TIE Bomber",
        skill: 7,
        points: 26,
        upgrades: [ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
    },
    {
        name: "Captain Kagi",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:58,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("gettargetableunits",this,function(n,p) {
		if (p.indexOf(self)>-1&&!self.dead) p=[self];
		return p;
	    });
	},
        unit: "Lambda-Class Shuttle",
        skill: 8,
        points: 27,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Colonel Jendon",
        faction:EMPIRE,
	pilotid:59,
	init: function() {
	    var self=this;
	    this.wrap_after("begincombatphase",this,function(l) {
		if (this.targeting.length>0) {
		    this.selectunit(this.selectnearbyally(1),function(p,k) {
			var t=this.targeting[0];
			p[k].addtarget(t);
			this.removetarget(t);
			p[k].log("+%1 %TARGET% / %0",t.name,1);
		    },["select unit to move %TARGET% (or self to cancel)"],true);
		}
		return l;
	    });
	},       
	done:true,
        unique: true,
        unit: "Lambda-Class Shuttle",
        skill: 6,
        points: 26,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Captain Yorr",
        faction:EMPIRE,
	pilotid:60,
        unique: true,
	done:true,
        unit: "Lambda-Class Shuttle",
        skill: 4,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("addstress",this,function() {
		var p=this.selectnearbyally(2);
		if (p.indexOf(self)>-1&&self.stress<=2&&!self.dead) {
		    this.log("%STRESS% -> %0 [%0]",self.name);
		    this.removestresstoken();
		    this.showinfo();
		    self.addstress();
		    self.showinfo();
		}
	    });
	},
        points: 24,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Omicron Group Pilot",
        faction:EMPIRE,
        done:true,
        unit: "Lambda-Class Shuttle",
        skill: 2,
	pilotid:61,
        points: 21,
        upgrades: [SYSTEM,CANNON,CREW,CREW],
    },
    {
        name: "Lieutenant Lorrir",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:62,
	wave:["aces"],
        unit: "TIE Interceptor",
        skill: 5,
        points: 23,
	resolveroll: function(n) {
	    var p=[];
	    for (var i=-20; i<=20; i+=20) {
		var mm=this.m.clone().translate(0,i).rotate(90,0,0);
		var mn=this.m.clone().translate(0,i).rotate(-90,0,0);
		p=p.concat([this.getpathmatrix(mm,"BR1").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BR1").rotate(90,0,0),
			    this.getpathmatrix(mm,"BL1").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BL1").rotate(90,0,0)]);
	    }
	    p=p.concat(this.getrollmatrix(this.m));
	    this.resolveactionmove(p,
		function(t,k) {
		    if (k<12) t.addstress();
		    t.endaction(n,"ROLL");
		},true,this.canmoveonobstacles("ROLL"));
	    return true;
	},
        upgrades: [ ],
    },
    {
        name: "Royal Guard Pilot",
        faction:EMPIRE,
        done:true,
	pilotid:63,
        unit: "TIE Interceptor",
        skill: 6,
        points: 22,
	wave:["aces"],
        upgrades: [ELITE],
    },
    {
        name: "Tetran Cowall",
        faction:EMPIRE,
        unique: true,
	done:true,
	pilotid:64,
	wave:["aces"],
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		var found=false;
		var m;
		for (var i in p) if (i.match(/K/)) {found=true; m=p[i]; break; }
		if (found&&!this.hasionizationeffect()) {
		    this.log("select %UTURN% speed");
		    for (var i=1; i<=5; i+=2) {
			if (typeof p["K"+i]=="undefined") {
			    p["K"+i]={move:"K"+i,difficulty:m.difficulty,halfturn:false};
			}
		    }
		} 
	    return p;
	    });
	},
        unit: "TIE Interceptor",
        skill: 7,
        points: 24,
        upgrades: [ELITE],
    },
    {
        name: "Kir Kanos",
        faction:EMPIRE,
	pilotid:65,
	wave:["aces"],
        init:  function() {
	    this.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) {
		    var r=this.getrange(targetunit);
		    return (r<=3&&r>=2&&this.canuseevade());
		}.bind(this),
		f:function(m,n) {
		    this.removeevadetoken();
		    this.log("+1 %HIT% for attacking at range 2-3");
		    return {m:m+FCH_HIT,n:n+1};
		}.bind(this),str:"evade"});
	},   
	done:true,
        unique: true,
        unit: "TIE Interceptor",
        skill: 6,
        points: 24,
        upgrades: [ ],
    },
    {
        name: "Carnor Jax",
        faction:EMPIRE,
	pilotid:66,
	wave:["aces"],
        init: function() {
	    var unit=this;
	    Unit.prototype.wrap_after("canusefocus",this,function(b) {
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b
	    });
	    Unit.prototype.wrap_after("canuseevade",this,function(b) {
		// Am I attacking Carnor Jax?
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("candofocus",this,function(b) {
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	    Unit.prototype.wrap_after("candoevade",this,function(b) {
		if (this.getrange(unit)==1&&this.isenemy(unit)&&!unit.dead) return false;
		return b;
	    });
	},
        unique: true,
	done:true,
        unit: "TIE Interceptor",
        skill: 8,
        points: 26,
        upgrades: [ELITE],
    },
    {
        name: "Bandit Squadron Pilot",
	faction:REBEL,
	pilotid:67,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 2,
        points: 12,
        upgrades: [MISSILE],
    },
    {
        name: "Tala Squadron Pilot",
	faction:REBEL,
	pilotid:68,
        done:true,
        unit: "Z-95 Headhunter",
        skill: 4,
        points: 13,
        upgrades: [MISSILE],
    },
    {
        name: "Lieutenant Blount",
	faction:REBEL,
	pilotid:69,
        done:true,
	init: function() {
	    this.wrap_after("hashit",this,function(t,b) {
		if (this.criticalresolved+this.hitresolved==0) 
		    this.log("%0 is hit",targetunit.name);
		return true;
	    });
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 6,
        points: 17,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Airen Cracken",
	faction:REBEL,
	pilotid:70,
	done:true,
	init: function() {
	    this.addafterattackeffect(this,function() {
		var p=this.selectnearbyally(1,function(t,s) { return s.candoaction(); });
		if (p.length>0) {
		    var unit=this;
		    this.doselection(function(n) {
			this.log("select unit for a free action"+p.length);
			this.resolveactionselection(p,function(k) {
			    var al=p[k].getactionlist();
			    //log("selected "+p[k].name+" "+al.length);
			    if (al.length>0) {
				p[k].doaction(al,"").done(function() { 
				    //log("endaction");
				    this.select();
				}.bind(this));
				this.endnoaction(n,"");
			    } else { 
				this.select(); this.endnoaction(n,""); }
			}.bind(this));
		    }.bind(this));
		}
	    });
	},
        unique: true,
        unit: "Z-95 Headhunter",
        skill: 8,
        points: 19,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Delta Squadron Pilot",
        faction:EMPIRE,
	pilotid:71,
        done:true,
        unit: "TIE Defender",
        skill: 1,
        points: 30,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Glaive Squadron Pilot",
        faction:EMPIRE,
        done:true,
	pilotid:72,
        unit: "TIE Defender",
        skill: 6,
        points: 34,
	wave:["aces"],
        upgrades: [ELITE,CANNON,MISSILE],
	shipimg:"tie-defender-red.png"
    },
    {
        name: "Onyx Squadron Pilot",
        done:true,
        faction:EMPIRE,
        pilotid:73,
        unit: "TIE Defender",
        skill: 3,
        points: 32,
        upgrades: [CANNON,MISSILE],
    },
    {
        name: "Colonel Vessery",
        done:true,
	pilotid:74,
        faction:EMPIRE,
	init: function() {
	    this.wrap_after("attackroll",this,function(n,r) {
		if (targetunit.istargeted.length>0&&this.targeting.length==0) {
		    this.addtarget(targetunit);
		    this.log("+%1 %TARGET% / %0",targetunit.name,1);	
		}
		return r;
	    });
	},
        unique: true,
        unit: "TIE Defender",
        skill: 6,
        points: 35,
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Rexler Brath",
        faction:EMPIRE,
	done:true,
	pilotid:75,
	init: function() {
	    this.addafterattackeffect(this,function(c,h) {
		if (this.canusefocus()&&this.hitresolved>0) {
		    this.log("-1 %FOCUS%, %0 damage -> %0 critical(s)",h);
		    this.donoaction([{name:this.name,org:this,type:"FOCUS",action:function(n) {
			var l=targetunit.criticals.length-1;
			this.removefocustoken();
			for (var i=0; i<this.hitresolved; i++) {
			    this.log(targetunit.criticals[l-i-this.criticalresolved].name);
			    targetunit.criticals[l-i-this.criticalresolved].faceup();
			}
			targetunit.checkdead();
			targetunit.show();
			this.endnoaction(n,"");
		    }.bind(this)}],"",true);
		}
	    });
	},
        unique: true,
        unit: "TIE Defender",
        skill: 8,
	wave:["aces"],
        points: 37,
        upgrades: [ELITE,CANNON,MISSILE],
    },
    {
        name: "Knave Squadron Pilot",
	faction:REBEL,
        done:true,
	pilotid:76,
        unit: "E-Wing",
        skill: 1,
        points: 27,
        upgrades: [SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Blackmoon Squadron Pilot",
        pilotid:77,
	faction:REBEL,
        done:true,
        unit: "E-Wing",
        skill: 3,
        points: 29,
        upgrades: [SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Etahn A'baht",
	done:true,
	pilotid:78,
	faction:REBEL,
        init:  function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return self.isally(activeunit)&&!self.dead&&self.isinfiringarc(targetunit);
		}, 
		aiactivate: function(m,n) { return FCH_hit(m); },
		f:function(m,n) {
		    if (FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
			return m+FCH_CRIT-FCH_HIT;
		    } 
		    return m;
		},str:"hit"});
	},        
        unique: true,
        unit: "E-Wing",
        skill: 5,
        points: 32,
        upgrades: [ELITE,SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Corran Horn",
	faction:REBEL,
	done:true,
	pilotid:79,
	init: function() {
	    this.addattack(function() { return true; },
			   this,this.weapons,
			   function() { 
			       this.log("no attack next round"); 
			       this.noattack=round+1; },
			   null,
			   "endcombatphase");
	},
        unique: true,
        unit: "E-Wing",
        skill: 8,
        points: 35,
        upgrades: [ELITE,SYSTEM,TORPEDO,ASTROMECH],
    },
    {
        name: "Sigma Squadron Pilot",
        faction:EMPIRE,
	pilotid:80,
        done:true,
        
        unit: "TIE Phantom",
        skill: 3,
        points: 25,
        upgrades: [SYSTEM,CREW],
    },
    {
        name: "Shadow Squadron Pilot",
        done:true,
        faction:EMPIRE,
        pilotid:81,
        unit: "TIE Phantom",
        skill: 5,
        points: 27,
        upgrades: [SYSTEM,CREW],
    },
    {
        name: "'Echo'",
        faction:EMPIRE,
	done:true,
	pilotid:82,
	getdecloakmatrix: function(m) {
	    console.log("decloak matrix of echo");
	    var i=0;
	    var m0=this.getpathmatrix(m,"BL2");
	    var m1=this.getpathmatrix(m,"BR2");
	    var p=[m,m0,m1];
	    for (i=-20; i<=20; i+=20) {
		var mm=m.clone().translate(0,i).rotate(90,0,0);
		var mn=m.clone().translate(0,i).rotate(-90,0,0);
		p=p.concat([this.getpathmatrix(mm,"BL2").rotate(-90,0,0),
			    this.getpathmatrix(mm,"BR2").rotate(-90,0,0),
			    this.getpathmatrix(mn,"BL2").rotate(90,0,0),
			    this.getpathmatrix(mn,"BR2").rotate(90,0,0)]);
	    }
	    return p;
	},          
        unique: true,
        unit: "TIE Phantom",
        skill: 6,
        points: 30,
        upgrades: [ELITE,SYSTEM,CREW],
    },
    {
        name: "'Whisper'",
        faction:EMPIRE,
	done:true,
	pilotid:83,
	init: function() {
	    this.wrap_after("hashit",this,function(t,h) {
		if (h) {
		    this.log("+1 %FOCUS%");
		    this.addfocustoken();
		}
		return h;
	    });
	},
        unique: true,
        unit: "TIE Phantom",
        skill: 7,
        points: 32,
        upgrades: [ELITE,SYSTEM,CREW],
    },
    {
        name: "Wes Janson",
	done:true,
	wave:["epic"],
	pilotid:84,
	init: function() {
	    this.wrap_before("cleanupattack",this,function() {
		if (targetunit.targeting.length>0) {
		    targetunit.log("-1 %TARGET% [%0]",this.name);
		    targetunit.removetarget(targetunit.targeting[0]);
		} else if (targetunit.focus>0) {
		    targetunit.log("-1 %FOCUS% [%0]",this.name);
		    targetunit.removefocustoken();
		} else if (targetunit.evade>0) {
		    targetunit.log("-1 %EVADE% [%0]",this.name);
		    targetunit.removeevadetoken();
		}
	    });
	},
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 8,
        points: 29,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "Jek Porkins",
	done:true,
	pilotid:85,
	wave:["epic"],
	init: function() {
	    this.wrap_after("addstress",this,function() {
		// Automatic removal of stress
		this.removestresstoken();
		var roll=this.rollattackdie(1,this,"blank")[0];
		this.log("-1 %STRESS%, roll 1 attack dice")
		if (roll=="hit") { this.applyhit(1); this.checkdead(); }
	    });
	},
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 7,
        points: 26,
        upgrades: [ELITE,TORPEDO,ASTROMECH],
    },
    {
        name: "'Hobbie' Klivian",
	faction:REBEL,
	done:true,
	wave:["epic"],
	pilotid:86,
	init: function() {
	    this.wrap_before("removetarget",this,function(t) {
		if (this.stress) { 	    
		    this.log("-1 %TARGET% -> -1 %STRESS%");
		    this.removestresstoken();
		}
	    });
            this.wrap_before("addtarget",this,function(t) {
		if (this.stress) { 
		    this.removestresstoken();
		    this.log("+1 %TARGET% -> -1 %STRESS%");
		}
	    });
	},
        unique: true,
        unit: "X-Wing",
        skill: 5,
        points: 25,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Tarn Mison",
	done:true,
	pilotid:87,
	wave:["epic"],
	init:function() {
            this.wrap_after("isattackedby",this,function(w,a) {
		if (this.targeting.length==0||this.getskill()<a.getskill()) { // TODO:Priority to define
		    this.log("+%1 %TARGET% / %0",a.name,1);
		    this.addtarget(a);
		}
	    });
	},
	faction:REBEL,
        unique: true,
        unit: "X-Wing",
        skill: 3,
        points: 23,
        upgrades: [TORPEDO,ASTROMECH],
    },
    {
        name: "Jake Farrell",
       	faction:REBEL,
	done:true,
	pilotid:88,
	wave:["aces"],
        freemove: function() {
	    var p=[];
	    if (this.candoboost()) 
		p.push(this.newaction(this.resolveboost,"BOOST"));
	    if (this.candoroll())
		p.push(this.newaction(this.resolveroll,"ROLL"));
	    this.doaction(p,"free %BOOST% or %ROLL% action");
	},
	init: function() {
	    this.wrap_before("addfocustoken",this,function() {
		if (this.candoaction()) this.freemove();
	    });
	},
        unique: true,
        unit: "A-Wing",
        skill: 7,
        points: 24,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Gemmer Sojan",
	done:true,
	pilotid:89,
	wave:["aces"],
	init: function() {
            this.wrap_after("getagility",this,function(a) {
		var r=this.selectnearbyenemy(1);
		if (r.length>0) {
		    return a+1;
		}
		return a;
	    });
	},
	faction:REBEL,
        unique: true,
        unit: "A-Wing",
        skill: 5,
        points: 22,
        upgrades: [MISSILE],
    },
    {
        name: "Keyan Farlander",
	faction:REBEL,
	done:true,
	pilotid:90,
	wave:["aces"],
	shipimg:"b-wing-1.png",
	init: function() {
	    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.stress>0; 
		}.bind(this),
		aiactivate: function(m,n) {
		    return true;
		},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    this.removestresstoken();
		    if (f>0) {
			this.log("%0 %FOCUS% -> %0 %HIT%, -1 %STRESS%",f);
			return m-FCH_FOCUS*f+FCH_HIT*f;
		    }
		    return m;
		}.bind(this),str:"stress",noreroll:"focus"
	    });
	},
        unique: true,
        unit: "B-Wing",
        skill: 7,
        points: 29,
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },
    {
        name: "Nera Dantels",
	faction:REBEL,
	done:true,
	pilotid:91,
	wave:["aces"],
	shipimg:"b-wing-1.png",
	init: function() {
	    this.log("can fire %TORPEDO% at 360 degrees");
	    this.wrap_after("isTurret",this,function(w,b) {
		if (w.type==TORPEDO) return true;
		return b;
	    })
	},
        unique: true,
        unit: "B-Wing",
        skill: 5,
        points: 26,
        upgrades: [ELITE,SYSTEM,CANNON,TORPEDO,TORPEDO],
    },

    {
        name: "Wild Space Fringer",
        done:true,
	pilotid:92,
	faction:REBEL,
        unit: "YT-2400",
        skill: 2,
        points: 30,
        upgrades: [CANNON,MISSILE,CREW],
    },
    {
        name: "Eaden Vrill",
	done:true,
	pilotid:93,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (sh.stress>0&&this.weapons[w].isprimary) { 
		    this.log("+1 attack die");
		    return a+1;
		}
		return a;
	    });
	},       
	faction:REBEL,       
        unit: "YT-2400",
        unique: true,
        skill: 3,
        points: 32,
        upgrades: [CANNON,MISSILE,CREW],
    },
    {
        name: "'Leebo'",
	faction:REBEL,
	done:true,
	pilotid:94,
	init: function() {
	    var newdeal=function(c,f,p) {
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.face==FACEUP) {
			var s1=this.selectdamage();
			CRITICAL_DECK[s1].count--;
			var s2=this.selectdamage();
			CRITICAL_DECK[s2].count--;
			var sc=[s1,s2];
			this.log("select one critical");
			this.selectcritical(sc,function(m) {
			    pp.resolve({crit:new Critical(this,m),face:FACEUP});
			}.bind(this));
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    this.wrap_after("deal",this,newdeal);
   	},
        unit: "YT-2400",
        unique: true,
        skill: 5,
        points: 34,
        upgrades: [ELITE,CANNON,MISSILE,CREW],
    },
    {
        name: "Dash Rendar",
	faction:REBEL,
	pilotid:95,
        unit: "YT-2400",
        unique: true,
        skill: 7,
	done:true,
	init: function() {
	    this.wrap_after("hascollidedobstacle",this,function(b) { 
		return false;
	    });
	    this.wrap_after("canmoveonobstacles",this,function() {
		return true;
	    });
	},
        points: 36,
        upgrades: [ELITE,CANNON,MISSILE,CREW],
    },
    {
        name: "Patrol Leader",
        faction:EMPIRE,
	done:true,
	pilotid:96,
        unit: "VT-49 Decimator",
        skill: 3,
        points: 40,
        upgrades: [TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Captain Oicunn",
        faction:EMPIRE,
        unit: "VT-49 Decimator",
        skill: 4,
        points: 42,
	pilotid:97,
        unique: true,
	done:true,
	init: function() {
	    this.wrap_before("resolvecollision",this,function() {
		for (var i=0; i<this.touching.length; i++) {
		    var u=this.touching[i];
		    if (u.isenemy(this)) {
			u.log("+1 %HIT% [%0]",this.name);
			u.resolvehit(1);
			u.checkdead();
		    }
		}
	    })
	},
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Commander Kenkirk",
        faction:EMPIRE,
	pilotid:98,
	init: function() {
	    this.wrap_after("getagility",this,function(a) {
		if (this.criticals.length>0) return a+1;
		return a;
	    });
	},
	done:true,
        unit: "VT-49 Decimator",
        skill: 6,
        points: 44,
        unique: true,
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Rear Admiral Chiraneau",
	pilotid:99,
        init:  function() {
	    this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return  (this.getrange(targetunit)<=2);
		}.bind(this),
		aiactivate: function(m,n) {
		    return FCH_focus(m);
		},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.log("1 %FOCUS% -> 1 %CRIT%");
			return m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"hit"});
	},        

        faction:EMPIRE,
        unit: "VT-49 Decimator",
        skill: 8,
        points: 46,
	done:true,
        unique: true,
        upgrades: [ELITE,TORPEDO,CREW,CREW,CREW,BOMB],
    },
    {
        name: "Prince Xizor",
        faction:SCUM,
	pilotid:100,
        modifydamageassigned: function(ch,attacker) {
	    var i;
	    var p=[];
	    if (ch==0) return 0;
	    var p=this.selectnearbyally(1);
	    if (p.length>0) {
		p.sort(function(a,b) { 
		    hpa=a.hull+a.shield; hpb=b.hull+b.shield;
		    if (hpa<hpb) return 1; 
		    if (hpa>hpb) return -1; 
		    return 0; });
		if (ch>=10) {
		    p[0].resolvecritical(1);
		    this.log("-1 %CRIT%");
		    p[0].log("+1 %CRIT% [%0]",this.name);
		    return ch-10;
		} 
		p[0].resolvehit(1);
		p[0].checkdead();
		this.log("-1 %HIT%");
		p[0].log("+%1 %HIT% [%0]",this.name,1);
		return ch-1;
	    }
	    return ch;
	},
        unique: true,
	done:true,
        unit: "StarViper",
        skill: 7,
        points: 31,
        upgrades: [ELITE,TORPEDO],
    },
    {
        name: "Guri",
        faction:SCUM,
	pilotid:101,
	/* TODO : may only do the action */
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		var p=this.selectnearbyenemy(1);
		if (p.length>0) {
		    console.log("+1 focus for Guri");
		    this.log("+1 %FOCUS%, ennemy at range 1");
		    this.addfocustoken();
		}
		return l;
	    });
	},       
	done:true,
        unique: true,
        unit: "StarViper",
        skill: 5,
        points: 30,
        upgrades: [ELITE,TORPEDO],
    },
    {
        name: "Black Sun Vigo",
        faction:SCUM,
        done:true,
	pilotid:102,
        unit: "StarViper",
        skill: 3,
        points: 27,
        upgrades: [TORPEDO],
    },
    {
        name: "Black Sun Enforcer",
        faction:SCUM,
	pilotid:103,
        done:true,
        unit: "StarViper",
        skill: 1,
        points: 25,
        upgrades: [TORPEDO],
    },
    {
        name: "Serissu",
        faction:SCUM,
	pilotid:104,
	done:true,
        init: function() {
	    var self=this;
	    Unit.prototype.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["blank","focus"],
		n:function() { return 1; },
		req:function(attacker,w,defender) {
		    // Serissu dead ? 
		    if (defender!=this&&!self.dead
			&&!this.dead&&defender.getrange(this)==1
			&&defender.isally(this)) {
			defender.log("+%1 reroll(s) [%0]",this.name,1);
			return true;
		    }
		    return false;
		}.bind(this)
	    });
	},
        unit: "M3-A Interceptor",
        skill: 8,
        points: 20,
        unique: true,
        upgrades: [ELITE],
    },
    {
        name: "Laetin A'shera",
        faction:SCUM,
	pilotid:105,
	init: function() {
            this.addafterdefenseeffect(this,function(c,h,t) {
		if (c+h==0) {
		    this.log("0 %HIT%, +1 %EVADE%");
		    this.addevadetoken();
		}
	    })
	},        
	done:true,
        unit: "M3-A Interceptor",
        skill: 6,
        points: 18,
        unique: true,
        upgrades: [ ],
    },
    {
        name: "Tansarii Point Veteran",
        faction:SCUM,
	pilotid:106,
        done:true,
        unit: "M3-A Interceptor",
        skill: 5,
        points: 17,
        upgrades: [ELITE],
    },
    {
        name: "Cartel Spacer",
        faction:SCUM,
	pilotid:107,
        done:true,
        unit: "M3-A Interceptor",
        skill: 2,
        points: 14,
        upgrades: [ ],
    },
    {
        name: "IG-88A",
	faction:SCUM,
	pilotid:108,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
	init: function(from) {
	    this.addafterattackeffect(this,function(c,h) {
		if ((typeof from=="undefined"||!from.dead)
		    &&targetunit.dead&&(this.shield<this.ship.shield)) {
		    this.addshield(1);
		    this.showstats();
		    this.log("+1 %SHIELD% for a kill");
		}
	    });
	},
	done:true,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88B",
	faction:SCUM,
	pilotid:109,
	done:true,
	init: function(from) {
	    var wn=[];
	    this.ig88battack=-1;
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type=="Cannon"&&w.isWeapon()) wn.push(w);
	    }
	    if (wn.length==0) return;
	    var wp=this.weapons.indexOf(wn[0]);
	    for (var i in this.weapons) 
		// TODO: immediateattack unused ?
		//this.weapons[i].immediateattack={pred:function(k) { return k==0; },weapon:function() { return wp;}};
	    this.addattack(function(c,h) { 
		return (c+h==0)&&(this.ig88battack<round)&&(typeof from=="undefined"||!from.dead);
	    },{name:"IG-88B"},wn,function () {
		this.ig88battack=round;
	    },function() { return squadron });
	},
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88C",
	faction:SCUM,
	pilotid:110,
	init: function(from) {
            this.wrap_before("resolveboost",this,function() {
		if (typeof from=="undefined"||!from.dead) {
		    this.log("free %EVADE% action [%0]","IG-88C");
		    this.doselection(function(n) { this.addevade(n); }.bind(this));
		}
	    })
	},
        done:true,
        unique: true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "IG-88D",
	faction:SCUM, 
	pilotid:111,
        init: function(from) {
	    this.wrap_after("getmaneuverlist",this,function(dial) {
		console.log("gml:"+dial["SL3"]);
		if (typeof dial["SL3"]!="undefined"&&(typeof from=="undefined"||!from.dead)) {
		    this.log("%SLOOPLEFT% or %TURNLEFT% maneuver");
		    console.log("added tl3");
		    dial["TL3"]={move:"TL3",halfturn:true,difficulty:dial["SL3"].difficulty};
		} 
		if (typeof dial["SR3"]!="undefined") {
		    this.log("%SLOOPRIGHT% or %TURNRIGHT% maneuver");
		    dial["TR3"]={move:"TR3",halfturn:true,difficulty:dial["SR3"].difficulty};
		} 
		return dial;
	    })
	},
        unique: true,
	done:true,
        unit: "Aggressor",
        skill: 6,
        points: 36,
        upgrades: [ELITE,SYSTEM,CANNON,CANNON,BOMB,ILLICIT],
    },
    {
        name: "N'Dru Suhlak",
        unique: true,
	done:true,
	wave:["6"],
	pilotid:112,
	faction:SCUM,
        init:  function() {
	    var g=this.getattackstrength;
	    this.getattackstrength=function(w,sh) {
		var a=g.call(this,w,sh);
		var p=this.selectnearbyally(2);
		if (p.length==0) {
		    if (typeof sh!="undefined") this.log("+1 attack against %0, at range >=3 of friendly ships",sh.name);
		    return a+1;
		} return a;
	    }.bind(this);
	},
        unit: "Z-95 Headhunter",
        skill: 7,
        points: 17,
        upgrades: [ELITE,MISSILE,ILLICIT],
    },
    {
        name: "Kaa'To Leeachos",
        unique: true,
	pilotid:113,
	faction:SCUM,
	done:true,
	wave:["6"],
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		var p=this.selectnearbyally(2);
		this.selectunit(p,function(p,k) {
		    if (p[k].evade>0) { 
			p[k].removeevadetoken(); this.addevadetoken(); 
			p[k].log("-1 %EVADE% [%0]",this.name);
			this.log("+1 %EVADE%");
		    } else if (p[k].focus>0) { 
			p[k].removefocustoken(); this.addfocustoken(); 
			p[k].log("-1 %FOCUS% [%0]",this.name);
			this.log("+1 %FOCUS%");
		    }
		},["select %FOCUS%/%EVADE% to take (or self to cancel)"],true);
		return l;
	    });
	},    
        unit: "Z-95 Headhunter",
        skill: 5,
        points: 15,
        upgrades: [ELITE,MISSILE,ILLICIT],
    },
    {
        name: "Black Sun Soldier",
        faction:SCUM,
	pilotid:114,
        done:true,
	wave:["6"],
        unit: "Z-95 Headhunter",
        skill: 3,
        points: 13,
        upgrades: [MISSILE,ILLICIT],
    },
    {
        name: "Binayre Pirate",
	faction:SCUM,
	pilotid:115,
        done:true, 
	wave:["6"],
        unit: "Z-95 Headhunter",
        skill: 1,
        points: 12,
        upgrades: [MISSILE,ILLICIT],
    },
    {
        name: "Boba Fett",
	faction:SCUM,
	pilotid:116,
	wave:["6"],
        unit: "Firespray-31",
        skill: 8,
        points: 39,
	init: function() {
	    var nrerolls=function() {
		var n=0;
		for (var i in squadron) {
		    var s=squadron[i];
		    if (this.getrange(s)==1&&this.isenemy(s)) n++;
		}
		return n;
	    }.bind(this);
	    var m={
		dice:["blank","focus"], 
		n: nrerolls, 
		req:function(attacker,w,defender) { return true; }
	    };
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,m);
	    this.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,$.extend({},m));
	},
	done:true,
        unique: true,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Kath Scarlet",
	done:true,
	wave:["6"],
	pilotid:117,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (!this.isinprimaryfiringarc(sh)&&isinfiringarc(sh)) { 
		    this.log("+1 attack die against %0 in auxiliary arc",sh.name);
		    a=a+1;
		}
		return a;
	    });
	},
        unique: true,
	faction:SCUM,      
        unit: "Firespray-31",
        skill: 7,
        points: 38,
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Emon Azzameen",
	done:true,
	unique:true,
	wave:["6"],
	pilotid:118,
	getbomblocation:function() {  return ["F1","TL3","TR3","F3"]; },
	faction:SCUM,
        unit: "Firespray-31",
        skill: 6,
        points: 36,
        upgrades: [CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Mandalorian Mercenary",
	faction:SCUM,  
	pilotid:119,
        done:true,
        unit: "Firespray-31",
        skill: 5,
        points: 35,
	wave:["6"],
        upgrades: [ELITE,CANNON,BOMB,CREW,MISSILE,ILLICIT],
    },
    {
        name: "Kavil",
        unique: true,
	done:true,
	wave:["6"],
	pilotid:120,
        init:  function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (!this.isinprimaryfiringarc(sh)) { /* firing arc = primary sector... */
		    console.log("kavil +1");
		    this.log("+1 attack die against %0 outside firing arc",sh.name);
		    return a+1;
		}
		return a;
	    });
	},       
	faction:SCUM,     
        unit: "Y-Wing",
        skill: 7,
        points: 24,
        upgrades: [ELITE,TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Drea Renthal",
        unique: true,
	pilotid:121,
	faction:SCUM,
        unit: "Y-Wing",
        skill: 5,
	done:true,
	wave:["6"],
	init: function() {
	    this.wrap_before("removetarget",this,function(t) {
		this.selectunit(this.gettargetableunits(3),function(p,k) {
		    if (this.targeting.indexOf(p[k])==-1) { 
			this.addtarget(p[k]);
			this.addstress();
		    }
		}, ["select unit to target, +1 %STRESS% (or self to cancel)"],true);
	    });
	},
        points: 22,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Hired Gun",
	faction:SCUM,
	pilotid:122,
	done:true,
        unit: "Y-Wing",
        skill: 4,
        points: 20,
	wave:["6"],
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Syndicate Thug",
	faction:SCUM,
	pilotid:123,
	done:true,
	wave:["6"],
        unit: "Y-Wing",
        skill: 2,
        points: 18,
        upgrades: [TURRET,TORPEDO,TORPEDO,SALVAGED],
    },
    {
        name: "Dace Bonearm",
        unique: true,
	pilotid:124,
	faction:SCUM,
        unit: "HWK-290",
	done:true,
	wave:["6"],
	init: function() {
	    var unit=this;
	    Unit.prototype.wrap_after("addiontoken",this,function() {
		if (!unit.dead&&this.getrange(unit)<=3 &&unit.isenemy(this)&&unit.stress==0) {
		    unit.addstress();
		    this.resolvehit(1);
		    unit.log("+1 %STRESS%");
		    this.log("+%1 %HIT% [%0]",unit.name,1);
		    this.checkdead();
		}
	    });
	},
        skill: 7,
        points: 23,
        upgrades: [ELITE,TURRET,CREW,ILLICIT],
    },
    {
        name: "Palob Godalhi",
        unique: true,
	pilotid:125,
	wave:["6"],
	faction:SCUM,
        unit: "HWK-290",
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    if (p[k].evade>0) { 
			p[k].removeevadetoken(); this.addevadetoken(); 
			p[k].log("-1 %EVADE% [%0]",this.name);
			this.log("+1 %EVADE%");
		    } else if (p[k].focus>0) { 
			p[k].removefocustoken(); this.addfocustoken(); 
			p[k].log("-1 %FOCUS% [%0]",this.name);
			this.log("+1 %FOCUS%");
		    }
		}, ["select %FOCUS%/%EVADE% to take (or self to cancel)"],true);
		return l;
	    });
	},    
	done:true,
        skill: 5,
        points: 20,
        upgrades: [ELITE,TURRET,CREW,ILLICIT],
    },
    {
        name: "Torkil Mux",
        unique: true,
	pilotid:126,
	done:true,
	wave:["6"],
	init: function() {
            this.wrap_after("endactivationphase",this,function() {
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    p[k].wrap_after("getskill",this,function(s) {
			return 0;
		    }).unwrapper("endcombatphase");
		},["select unit for a 0 PS"],false);
	    });
	},  
	faction:SCUM,
        unit: "HWK-290",
        skill: 3,
        points: 19,
        upgrades: [TURRET,CREW,ILLICIT],
    },
    {
        name: "Spice Runner",
	faction:SCUM,
	pilotid:127,
	done:true,
        unit: "HWK-290",
        skill: 1,
        points: 16,
	wave:["6"],
        upgrades: [TURRET,CREW,ILLICIT],
    },
    {
        name: "Commander Alozen",
        faction:EMPIRE,
	pilotid:128,
        unit: "TIE Advanced",
        unique: true,
	done:true,
        skill: 5,
	wave:["epic"],
        points: 25,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		this.selectunit(this.gettargetableunits(1),function(p,k) {
		    this.addtarget(p[k]);
		    this.log("+%1 %TARGET% / %0",p[k].name,1);
		},["select unit to lock (or self to cancel)"],true);
		return l;
	    })
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Juno Eclipse",
        unique: true,
	pilotid:129,
	done:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 8,
	wave:["epic"],
        points: 28,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		if (this.hasionizationeffect()) return p;
		for (var i in p) {
		    var m=p[i];
		    var speed = parseInt(m.move.substr(-1),10);
		    for (var i=-1; i<=1; i++) {
			var r=m.move.replace(/\d/,(speed+i)+"");
			if (typeof P[r]!="undefined") {
			    p[r]={move:r,difficulty:m.difficulty,halfturn:m.halfturn};
			}
		    }
		}
		return p;
	    });
	},
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Zertik Strom",
        unique: true,
	pilotid:130,
	done:true,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 6,
	wave:["epic"],
	init: function() {
	    var unit=this;
	    Weapon.prototype.wrap_after("getrangeattackbonus",this,function(sh,g) {
		if (this.unit.isenemy(unit)&&unit.getrange(this.unit)==1) {
		    this.unit.log("0 attack range bonus [%0]",unit.name);
		    return 0;
		}
		return g;
	    });
	    Weapon.prototype.wrap_after("getrangedefensebonus",this,function(sh,g) {
		if (this.unit.isenemy(unit)&&unit.getrange(this.unit)==1) {
		    this.unit.log("0 defense range bonus [%0]",unit.name);
		    return 0;
		}
		return g;
	    });
	},
        points: 26,
        upgrades: [ELITE,MISSILE],
    },
    {
        name: "Lieutenant Colzet",
        unique: true,
	pilotid:131,
        faction:EMPIRE,
	unit: "TIE Advanced",
        skill: 3,
        points: 23,
        upgrades: [MISSILE],
	done:true,
	wave:["epic"],
	init: function() {
	    this.wrap_before("endphase",this,function() {
		this.selectunit(this.targeting,function(p,k) {
		    if (this.canusetarget(p[k])) {
			var c=p[k].criticals;
			this.removetarget(p[k]);
			if (c.length>0) c[rand(c.length)].faceup();
		    }
		},["select unit (or self to cancel)"],true);
	    });
	},
    },
    {
        name: "Bossk",
        faction: SCUM,
	pilotid:132,
        unit: "YV-666",
        unique: true,
        skill: 7,
        points: 35,
	done:true,
	init: function() {
	    this.wrap_after("hashit",this,function(t,b) {
		var p=this.criticalresolved+this.hitresolved;
		if (b&&this.criticalresolved>0) {
		    if (p<=t.shield||(t.hull<=2&&p>t.shield)) { 
			this.criticalresolved--;
			this.hitresolved+=2;
			this.log("1 %CRIT% -> 2 %HIT%");
		    } else this.log("%0 %SHIELD% are down, more than 2 %HULL%: keeping critical",t.name);
		}
		return b;
	    })
	},
        upgrades: [ELITE,CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Moralo Eval",
        faction: SCUM,
	pilotid:133,
        unit: "YV-666",
        unique: true,
        skill: 6,
        points: 34,
	done:true,
	init: function() {
	    for (var i=0; i<this.weapons.length; i++) {
		if (this.weapons[i].type=="Cannon") {
		    this.log("can fire %0 in auxiliary firing arc",this.weapons[i].name);
		    this.weapons[i].auxiliary=this.weapons[0].auxiliary;
		    this.weapons[i].subauxiliary=this.weapons[0].subauxiliary;
		}
	    }
	},
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Latts Razzi",
        faction: SCUM,
	pilotid:134,
        unit: "YV-666",
        unique: true,
        skill: 5,
        points: 33,
	done:true,
	init: function() {
	    var self=this;
	    /* TODO: twice */
	    Unit.prototype.wrap_after("declareattack",this,function(wp,t,b) {
		if (!b) return b;
		if (!self.dead&&self.isally(this)&&self.canusetarget(t))
		    self.donoaction([this.newaction(function(n) {
			this.removetarget(t);
			t.wrap_after("getdefensestrength",self,function(i,sh,d) {
			    return (d>0)?d-1:d;
			}).unwrapper("afterdefenseeffect");
			this.endnoaction(n,"TARGET");
		    }.bind(self),"TARGET")],self.name+": -1 agility for "+t.name,true);
		return b;
	    });
	},
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Trandoshan Slaver",
        faction: SCUM,
	pilotid:135,
        unit: "YV-666",
	done:true,
        skill: 2,
        points: 29,
        upgrades: [CANNON,MISSILE,CREW,CREW,CREW,ILLICIT]
    },
    {
        name: "Talonbane Cobra",
        unique: true,
        faction: SCUM,
	pilotid:136,
        unit: "Kihraxz Fighter",
        skill: 9,
        upgrades: [ELITE,MISSILE,ILLICIT],
	done:true,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(i,sh,a) {
		return a+this.weapons[i].getrangeattackbonus(sh);
	    });
	    this.wrap_after("getdefensestrength",this,function(i,sh,a) {
		return a+sh.weapons[i].getrangedefensebonus(this);
	    });
	},
        points: 28,
    },
    {
        name: "Graz the Hunter",
        unique: true,
	pilotid:137,
        faction: SCUM,
        unit: "Kihraxz Fighter",
        skill: 6,
        upgrades: [MISSILE,ILLICIT],
	init: function() {
	    this.wrap_after("getdefensestrength",this,function(i,sh,a) {
		if (this.weapons[i].getsector(sh)<=3) {
		    a=a+1;
		    this.log("+1 defense die for defending in firing arc");
		}
		return a;
	    });
	},
	done:true,
        points: 25
    },
    {
        name: "Black Sun Ace",
        faction: SCUM,
	pilotid:138,
        unit: "Kihraxz Fighter",
	done:true,
            skill: 5,
            upgrades: [ELITE,MISSILE,ILLICIT],
            points: 23
        },
        {
            name: "Cartel Marauder",
	    done:true,
	    pilotid:139,
            faction: SCUM,
            unit: "Kihraxz Fighter",
            skill: 2,
            upgrades: [MISSILE,ILLICIT],
            points: 20
        },
        {
            name: "Miranda Doni",
            unique: true,
	    pilotid:140,
	    done:true,
            faction: REBEL,
            unit: "K-Wing",
            skill: 8,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
	    mirandaturn:-1,
	    preattackroll: function(w,t) {
		if (this.mirandaturn!=round) {
		    var a1={org:this,name:this.name,type:"SHIELD",action:function(n) {
			this.mirandaturn=round;
			this.log("-1 attack die");
			this.wrap_after("getattackstrength",this,function(i,sh,a){
			    var ra= this.weapons[i].getrangeattackbonus(sh);
			    if (a-ra>0) a=a-1;			    
			    return a;
			}).unwrapper("attackroll");
			if (this.shield<this.ship.shield) {
			    this.addshield(1); 
			    this.log("+1 %SHIELD%");
			}
			this.endnoaction(n,"SHIELD");
		    }.bind(this)};
		    var a2={org:this,name:this.name,type:"HIT",action:function(n) {
			this.log("-1 %SHIELD%");
			this.log("+1 attack die");
			this.mirandaturn=round;
			this.wrap_after("getattackstrength",this,function(i,sh,a){
			    return 1+a;
			}).unwrapper("attackroll");
			this.removeshield(1); 
			this.endnoaction(n,"HIT");
		    }.bind(this)};
		    var list=[];
		    if (this.shield>0) list.push(a2);
		    if (this.shield<this.ship.shield) list.push(a1);
		    this.donoaction(list,"select to add shield/roll 1 fewer die or remove shield/roll 1 additional die",true);
		}
	    },
            points: 29,
        },
        {
            name: "Esege Tuketu",
            unique: true,
	    pilotid:141,
            faction: REBEL,
            unit: "K-Wing",
            skill: 6,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 28,
	    done:true,
	    init: function() {
		var self=this;
		Unit.prototype.wrap_before("beginattack",this,function() {
		    if (!self.dead&&this!=self&&this.isally(self)) {
			this.wrap_after("canusefocus",self,function(b) {
			    return b||(self.canusefocus()&&this.getrange(self)<=2);
			}).unwrapper("endattack");
			this.wrap_before("removefocustoken",self,function() {
			    if (this.getrange(self)<=2) {
				this.focus++; // compensate
				self.log("-1 %FOCUS% [%0]",this.name);
				self.removefocustoken();
			    }
			}).unwrapper("endattack");
		    }
		})
	    }
        },
        {
            name: "Guardian Squadron Pilot",
            faction: REBEL,
	    pilotid:142,
	    done:true,
            unit: "K-Wing",
            skill: 4,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 25
        },
        {
            name: "Warden Squadron Pilot",
            faction: REBEL,
	    pilotid:143,
	    done:true,
            unit: "K-Wing",
            skill: 2,
            upgrades: [TURRET,TORPEDO,TORPEDO,MISSILE,CREW,BOMB,BOMB],
            points: 23
        },
        {
            name: "'Redline'",
            unique: true,
	    pilotid:144,
            faction: EMPIRE,
            unit: "TIE Punisher",
            skill: 7, 
	    done:true,
	    init: function() {
		this.wrap_after("addtarget",this,function(sh) {
		    this.log("+%1 %TARGET% / %0",sh.name,2);
		    this.targeting.push(sh);
		    sh.istargeted.push(this);
		    this.movelog("T-"+sh.id);
		    sh.show();
		    this.show();
		});
	    },
	    /* TODO: A bit too automatic */
	    boundtargets: function(sh) {
		var p=this.targeting;
		if (this.targeting.indexOf(sh)>-1) return true;
		for (var i=p.length-2;i>=0; i++) this.removetarget(p[i]);
		return false;
	    },
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 27
        },
        {
            name: "'Deathrain'",
            unique: true,
	    pilotid:145,
            faction: EMPIRE,
            unit: "TIE Punisher",
            skill: 6,
	    done:true,
	    init: function() {
		this.wrap_after("getbombposition",this,function(lm,size,p) {
		    for (var i=0; i<lm.length; i++)
			p.push(this.getpathmatrix(this.m.clone(),lm[i]).translate(0,-size+20));
		    return p;
		});
		this.wrap_after("bombdropped",this,function() {
		    if (this.candoroll()&&this.candoaction()) {
			$("#activationdial").hide();
			this.doaction([this.newaction(this.resolveroll,"ROLL")],"free %ROLL% action")
		    }
		});
	    },
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 26
        },
        {
            name: "Black Eight Squadron Pilot",
            faction: EMPIRE,
	    pilotid:146,
	    done:true,
            unit: "TIE Punisher",
            skill: 4,
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 23
        },
        {
            name: "Cutlass Squadron Pilot",
            faction: EMPIRE,
	    done:true,
	    pilotid:147,
            unit: "TIE Punisher",
            skill: 2,
            upgrades: [SYSTEM,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB,BOMB],
            points: 21
        },
        {
            name: "Poe Dameron",
            faction: REBEL,
	    pilotid:148,
            unit: "T-70 X-Wing",
	    unique:true,
	    done:true,
	    ambiguous:true,
            skill: 8,
            upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	    init: poe_fct,
            points: 31
        },
      {
	  name: "'Blue Ace'",
	  faction: REBEL,
	  done:true,
	  pilotid:149,
	  unit: "T-70 X-Wing",
	  skill: 5,
	  unique:true,
	  getboostmatrix:function(m) {
	      console.log("blue ace boost");
	      return [this.getpathmatrix(m,"TR1"),
		this.getpathmatrix(m,"TL1")]
	      .concat(Unit.prototype.getboostmatrix.call(this,m));
	  },
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 27
      },
      {
	  name: "Ello Asty",
	  faction: REBEL,
	  done:true,
	  pilotid:150,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 7,
	  unique:true,
	  init: function() {
	      var save=[];
	      this.wrap_after("getdial",this,function(gd) {
		  if (save.length==0)
		      for (var i=0; i<gd.length; i++) {
			  var move=gd[i].move;
			  var d=gd[i].difficulty;
			  if (move.match(/TR[RL]\d/)) d="WHITE";
			  save[i]={move:move,difficulty:d};
		      }
		  console.log("ello asty "+this.stress);
		  if (this.stress==0) return save; else return gd;
	      })
	  },
	  upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	  points: 30
      },
      {
	  name: "'Red Ace'",
	  faction: REBEL,
	  done:true,
	  pilotid:151,
	  beta:true,
	  unit: "T-70 X-Wing",
	  skill: 6,
	  unique:true,
	  init: function() { 
	      this.sr=-1;
	      this.wrap_after("removeshield",this,function(n) {
		  if (this.sr<round) {
		      this.log("+1 %SHIELD%");
		      this.sr=round; 
		      this.addevadetoken();
		  }
	      });
	  },
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 29
      },
      {
	  name: "Blue Squadron Novice",
	  faction: REBEL,
	  done:true,
	  unit: "T-70 X-Wing",
	  wave:["aces",8],
	  skill: 2,
	  pilotid:152,
	  upgrades: [TORPEDO,ASTROMECH,TECH],
	  points: 24
      },
     {
	  name: "Red Squadron Veteran",
	  faction: REBEL,
	 pilotid:153,
	  done:true,
	  unit: "T-70 X-Wing",
	 wave:["aces",8],
	  skill: 4,
	 upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	  points: 26
      },
    {
	name: "Omega Squadron Pilot",
	faction: EMPIRE,
	done:true,
	pilotid:154,
	unit: "TIE/FO Fighter",
	skill: 4,
	upgrades: [TECH,ELITE],
	points: 17
      },
    {
	name: "Zeta Squadron Pilot",
	faction: EMPIRE,
	done:true,
	pilotid:155,
	unit: "TIE/FO Fighter",
	skill: 3,
	upgrades: [TECH],
	points: 16
      },
   {
	  name: "Epsilon Squadron Pilot",
	  faction: EMPIRE,
	  done:true,
       pilotid:156,
	  unit: "TIE/FO Fighter",
	  skill: 1,
       upgrades: [TECH],
	  points: 15
      },
   {
	  name: "'Zeta Ace'",
	  faction: EMPIRE,
	  done:true,
       pilotid:157,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 5,
	  getrollmatrix:function(m) {
	var m0=this.getpathmatrix(m.clone().rotate(90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(-90,0,0);
	var m1=this.getpathmatrix(m.clone().rotate(-90,0,0),"F2").translate(0,(this.islarge?20:0)).rotate(90,0,0);
	return [m0.clone().translate(0,-20),
		m0,
		m0.clone().translate(0,20),
		m1.clone().translate(0,-20),
		m1,
		m1.clone().translate(0,20)]
	.concat(Unit.prototype.getrollmatrix.call(this,m));
    },
       upgrades: [ELITE,TECH],
	  points: 18
      },
   {
       name: "'Epsilon Leader'",
       faction: EMPIRE,
       done:true,
       pilotid:158,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 6,
       init: function() {
	   this.wrap_after("begincombatphase",this,function(l) {
	       var p=this.selectnearbyally(1);
	       p.push(this);
	       for (var i=0; i<p.length; i++) p[i].removestresstoken();
	       return l;
	   });
       },
       upgrades: [TECH],
       points: 19
   },
   {
       name:"'Epsilon Ace'",
       faction:EMPIRE,
       done:true,
       pilotid:159,
       unique:true,
       unit:"TIE/FO Fighter",
       skill:4,
       init: function() {
	   this.wrap_after("getskill",this,function(s) {
	       if (this.criticals.length==0) return 12;
	       return s;
	   });
       },
       upgrades:[TECH],
       points:17
   },
   {
	  name: "'Omega Ace'",
	  faction: EMPIRE,
	  done:true,
       pilotid:160,
	  unique:true,
	  unit: "TIE/FO Fighter",
	  skill: 7,
	  init: function() {
	      this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		  req:function(m,n) { 
		      return this.canusefocus()&&this.targeting.indexOf(targetunit)>-1;
		  }.bind(this),
		  f:function(m,n) {
		      this.removefocustoken();
		      this.removetarget(targetunit);
		      this.log("all results are %CRIT%");
		      return n*FCH_CRIT;
		  }.bind(this),str:"critical"});
       },
       upgrades: [ELITE,TECH],
	  points: 20
      },
   {
       name: "'Omega Leader'",
       faction: EMPIRE,
       beta:true,
       pilotid:161,
       unique:true,
       unit: "TIE/FO Fighter",
       skill: 8,
       upgrades: [ELITE,TECH],
       points: 21,
       done:true,
       init: function() {
	   var self=this;
	    this.wrap_after("isattackedby",this,function(w,a) {
		if (self.targeting.indexOf(a)>-1) 
		    a.wrap_after("getdicemodifiers",self,function(mods) {
			var p=[];
			for (var i=0; i<mods.length; i++)
			    if (mods[i].from!=ATTACK_M) p.push(mods[i]);
			return mods;
		    }).unwrapper("endattack");
	    })
	    this.wrap_before("resolveattack",this,function(w,t) {
		if (this.targeting.indexOf(t)>-1) 
		    t.wrap_after("getdicemodifiers",this,function(mods) {
			var p=[];
			for (var i=0; i<mods.length; i++)
			    if (mods[i].from!=DEFENSE_M) p.push(mods[i]);
			
			return mods;
		    }).unwrapper("endbeingattacked");
	    });
	   this.wrap_after("setpriority",this,function(a) {
	       if (a.type=="TARGET"&&this.candotarget()&&this.targeting.length==0) 
		   a.priority+=10;
	   });
       }
   },
    {
	name:"Hera Syndulla",
	unique:true,
	faction:REBEL,
	unit:"VCX-100",
	skill:7,
	pilotid:162,
	ambiguous:true,
	edition:"VCX-100",
	points:40,
	done:true,
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW],
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		return hera_fct.call(this,p); 
	    });
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type==TORPEDO) {
		    w.auxiliary=AUXILIARY,
		    w.subauxiliary=SUBAUXILIARY
		}
	    }
	}
   },
    {
	name:"'Chopper'",
	unique:true,
	pilotid:163,
	faction:REBEL,
	unit:"VCX-100",
	skill:4,
	points:37,
	done:true,
	init: function() {
	    this.wrap_after("begincombatphase",this,function(l) {
		for (var i=0; i<this.touching.length; i++) {
		    if (this.touching[i].isenemy(this.team)) {
			this.touching[i].addstress();
			this.touching[i].log("+1 %STRESS% [%0]",this.name);
		    }
		}
		return l;
	    });
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type==TORPEDO) {
		    w.auxiliary=AUXILIARY,
		    w.subauxiliary=SUBAUXILIARY
		}
	    }
	},
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW]
    },
    {
	name:"Ezra Bridger",
	faction:REBEL,
	unique:true,
	done:true,
	pilotid:164,
	unit:"Attack Shuttle",
	skill:4,
	points:20,
	init: function() {
	    this.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return this.stress>0;
		}.bind(this), 
		f:function(m,n) {
		    var f=FE_focus(m);
		    if (f>2) f=2;
		    if (f>0) {
			this.log("%0 %FOCUS% -> %0 %EVADE%",f);
			return m-f*FE_FOCUS+f*FE_EVADE;
		    } 
		    return m;
		}.bind(this),str:"focus"});

	},        
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"Hera Syndulla",
	faction:REBEL,
	unique:true,
	done:true,
	pilotid:165,
	unit:"Attack Shuttle",
	skill:7,
	ambiguous:true,
	edition:"Attack Shuttle",
	points:22,
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		return hera_fct.call(this,p); 
	    });
	},
	upgrades:[ELITE,TURRET,CREW],
    },
    {
	name:"Sabine Wren",
	faction:REBEL,
	unique:true,
	done:true,
	pilotid:166,
	unit:"Attack Shuttle",
	skill:5,
	points:21,
	ambiguous:true,
	edition:"Attack Shuttle",
	init: function() {
	    this.wrap_after("beginactivation",this,sabine_fct);
	},
	upgrades:[ELITE,TURRET,CREW]
    },
    {
	name:"'Zeb' Orrelios",
	faction:REBEL,
	unique:true,
	ambiguous:true,
	edition:"Attack Shuttle",
	unit:"Attack Shuttle",
	skill:3,
	pilotid:167,
	points:18,
	done:true,
	cancelhit:zeb_fct,
	upgrades:[TURRET,CREW]
    },
    {
	name:"Kanan Jarrus",
	faction:REBEL,
	unique:true,
	pilotid:168,
	unit:"VCX-100",
	skill:5,
	points:38,
	upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW],
	done:true,
	init:function() {
	    var self=this;
	    for (var i=0; i<this.weapons.length; i++) {
		var w=this.weapons[i];
		if (w.type==TORPEDO) {
		    w.auxiliary=AUXILIARY,
		    w.subauxiliary=SUBAUXILIARY
		}
	    }
	    Unit.prototype.wrap_after("preattackroll",this,function(w,t) {
		var p=this.selectnearbyenemy(2);
		var attacker=this;
		if (self.canusefocus()&&p.indexOf(self)>-1&&!self.dead) { 
		    self.donoaction([{org:self,name:self.name,type:"FOCUS",action:function(n) {
			this.wrap_after("getattackstrength",self,function(i,t,a) {
			    NOLOG=true;
			    var ra= this.weapons[i].getrangeattackbonus(t);
			    a=a-ra;
			    NOLOG=false;
			    if (a>0) a=a-1;			    
			    return a+ra;
			}).unwrapper("attackroll");
			self.removefocustoken();
			this.log("-1 attack against %0",self.name);
			this.select();
			self.endnoaction(n,"FOCUS");
		    }.bind(this)}],"",true);
		}
	    });
	}
    },
    {
	name:"'Wampa'",
	faction:EMPIRE,
	unique:true,
	pilotid:169,
	unit:"TIE Fighter",
	wave:["epic"],
	skill:4,
	points:14,
	done:true,
	init: function() {
	    this.adddicemodifier(ATTACKCOMPARE_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { return n>0; },
		f:function(m,n) {
		    this.log("cancel all dice");
		    if (FCH_crit(m)>0) {
			targetunit.log("+1 damage card [%0]",this.name);
			targetunit.applydamage(1);
		    }
		    return {m:0,n:0};
		}.bind(this),str:"critical"});
	},
	upgrades:[]
    },
    { 
	name:"'Youngster'",
	faction:EMPIRE,
	unique:true,
	pilotid:170,
	unit:"TIE Fighter",
	skill:6,
	wave:["epic"],
	points:15,
	done:true,
	init: function() {
	    var elite=null;
	    var self=this;
	    for (i=0; i<this.upgrades.length; i++) {
		if (this.upgrades[i].type==ELITE&&(typeof this.upgrades[i].action=="function")){ 
		    elite=$.extend({}, this.upgrades[i]);
		    elite.clone=true;
		    elite.isactive=true;
		}
	    }
	    if (elite==null) return;
	    this.log("share %0 upgrade",elite.name);
	    Unit.prototype.wrap_after("getupgactionlist",self,function(l) {
		var p=this.selectnearbyally(3);
		if (!self.dead&&this.ship.name.match(/.*TIE.*Fighter.*/)&&p.indexOf(self)>-1&&elite.candoaction()&&elite.isactive) {
		    this.log("elite action from %0 available",self.name);
		    elite.unit=this;
		    l.push({org:elite,action:elite.action,type:elite.type.toUpperCase(),name:elite.name});
		}
		return l;
	    });
	},
	upgrades:[ELITE]
    },
    {
	name:"'Chaser'",
	faction:EMPIRE,
	unique:true,
	pilotid:171,
	done:true,
	unit:"TIE Fighter",
	skill:3,
	wave:["epic"],
	points:14,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("removefocustoken",this,function() {
		if (!self.dead&&this.isally(self)&&this!=self&&this.getrange(self)<=1) {
		    self.log("+1 %FOCUS%");
		    self.addfocustoken();
		}
	    });
	},
	upgrades:[]
    },
    {
	name:"Gamma Squadron Veteran",
	faction:EMPIRE,
	pilotid:172,
	done:true,
	unit:"TIE Bomber",
	skill:5,
	wave:["aces"],
	points:19,
	upgrades:[ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB]
    },
    {
	name:"The Inquisitor",
	faction:EMPIRE,
	pilotid:173,
	unit:"TIE Adv. Prototype",
	skill:8,
	unique:true,
	done:true,
	points:25,
	init: function() {
	    var self=this;
	    //0 is primary
	    this.weapons[0].wrap_after("getrangedefensebonus",this,function(sh,b) {
		if (b==1) this.unit.log("defense range nullified");
		return 0;
	    });
	    this.wrap_after("getattackstrength",this,function(i,sh,a) {
		if (i==0) {
		    if (this.weapons[0].getrange(sh)>1) {
			this.log("+1 attack die with primary weapon [%0]",this.name);
			return a+1;
		    }
		} 
		return a;
	    });
	},
	upgrades:[ELITE,MISSILE]
    },
    {
	name:"Valen Rudor",
	faction:EMPIRE,
	unique:true,
	pilotid:174,
	unit:"TIE Adv. Prototype",
	skill:6,
	points:22,
	done:true,
	init: function() {
	    this.addafterdefenseeffect(this,function(c,h,t) {
		if (this.candoaction()) {
		    this.log("+1 free action [%0]",this.name);
		    this.doaction(this.getactionlist(),"");
		}
	    });
	},
	upgrades:[ELITE,MISSILE]
    },
   {
       name:"Sienar Test Pilot",
       faction:EMPIRE,
       pilotid:175,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:2,
       points:16,
       upgrades:[MISSILE]
    },
   {
       name:"Zuckuss",
       faction:SCUM,
       pilotid:176,
       unique:true,
       unit:"G-1A Starfighter",
       skill:7,
       points:28,
       done:true,
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT],
       preattackroll: function(w,t) {
	   var a1={org:this,name:this.name,type:"HIT",action:function(n) {
	       this.log("+1 attack die");
	       this.wrap_after("getattackstrength",this,function(i,sh,a){
		   return 1+a;
	       }).unwrapper("attackroll");
	       targetunit.wrap_after("getdefensestrength",this,function(i,sh,d) {
		   return 1+d;
	       }).unwrapper("defenseroll");
	       this.endnoaction(n,"HIT");
	   }.bind(this)};
	   this.donoaction([a1],"select to add +1 attack roll",true);
       }
    },
   {
       name:"4-LOM",
       faction:SCUM,
       pilotid:177,
       unique:true,
       done:true,
       unit:"G-1A Starfighter",
       skill:6,
       points:27,
       init: function() {
	   this.wrap_before("endphase",this,function() {
	       var p=this.selectnearbyunits(1,function() {return true;});
	       if (this.stress>0)
		   this.selectunit(p,function(p,k) {
		       p[k].addstress();
		       this.removestresstoken();
		       p[k].log("+1 %STRESS% [%0]",this.name);
		       this.log("-1 %STRESS%");		   
		   },["select unit (or self to cancel)"],true);
	   });
       },
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT]
    },
    {
        name: "Nashtah Pup Pilot",
	faction:SCUM,
        done:true,
	pilotid:178,
	unique:true,
        unit: "Z-95 Headhunter",
        skill: 2,
	wave:["8"],
        points: 0,
        upgrades: [],
    },
    {
	name:"Dengar",
	faction:SCUM,
	unique:true,
	pilotid:179,
	unit:"JumpMaster 5000",
	skill:9,
	points:33,
	done:true,
	init: function() {
	    var self=this;
	    this.dengarattack=-1;
	    this.addattack(function(c,h,t) { 
		// Side effect ! 
		this.retaliationtarget=t;
		return this.dengarattack<round&&t!=this
		    &&this.isinprimaryfiringarc(t); 
	    }, this,this.weapons,function() {
		this.dengarattack=round;
	    },function() {
		return [this.retaliationtarget];
	    },"endbeingattacked");
	},
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    {
	name:"Tel Trevura",
	faction:SCUM,
	unique:true,
	pilotid:180,
	unit:"JumpMaster 5000",
	skill:7,
	points:30,
	done:true,
	init: function() {
	    this.resurrected=false;
	    this.wrap_before("checkdead",this,function() {
		if (this.hull<=0&&!this.dead&&!this.resurrected) {
		    this.addhull(this.ship.hull-this.hull);
		    this.criticals=[];
		    SOUNDS.explode.play();
		    this.resurrected=true;
		    this.log("resists!");
		    this.applydamage(4);
		    this.showoverflow();
		}
	    });
	},
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    {
	name:"Manaroo",
	faction:SCUM,
	pilotid:181,
	unit:"JumpMaster 5000",
	skill:4,
	unique:true,
	points:27,
	done:true,
	init: function() {
	    var self=this;/* FAQ v4.3 */
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyally(1),function(p,k) {
		    var f=this.focus,e=this.evade
		    for (var i=0; i<f; i++) {
			this.removefocustoken();
			p[k].addfocustoken();
		    }
		    for (var i=0; i<e; i++) {
			this.removeevadetoken();
			p[k].addevadetoken();
		    }
		    var t=this.targeting;
		    for (var i=t.length-1;i>=0; i--) {
			var u=t[i];
			this.removetarget(u);
			p[k].addtarget(u);
		    }
		    var t=this.istargeted;
		    for (var i=t.length-1;i>=0; i--) {
			var u=t[i];
			u.removetarget(this);
			u.addtarget(p[k]);
		    }
		},["select unit (or self to cancel) [%0]",this.name],true);
	    });
	},
	upgrades:[ELITE,TORPEDO,TORPEDO,CREW,SALVAGED,ILLICIT]
    },
    { name:"Tomax Bren",
      faction:EMPIRE,
      pilotid:182,
      unit:"TIE Bomber",
      skill:8,
      wave:["aces"],
      unique:true,
      done:true,
      points:24,
      upgrades:[ELITE,TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
      init: function() {
	  var self=this;
	  self.flip=-1;
	  for (var i=0; i<this.upgrades.length; i++) {
	      var upg=this.upgrades[i];
	      if (upg.type==ELITE) (function(upg) {
		  upg.wrap_after("desactivate",this,function() {
		      if (self.flip<round) { 
			  self.donoaction([{org:self,name:self.name,type:"ELITE",
					    action:function(n) {
						upg.isactive=true;
						self.log("name reactivated:"+upg.name);
						//if (typeof upg.init=="function") upg.init(self);
						self.flip=round;
						self.endnoaction(n,"ELITE");
					    }}],"Choose to reactivate an elite upgrade (or not)",true);
		      }
		  });
	      })(upg);
	  }
      },
    },
    { name:"Lothal Rebel",
      faction:REBEL,
      done:true,
      unit:"VCX-100",
      skill:3,
      pilotid:183,
      points:35,
      upgrades:[SYSTEM,TURRET,TORPEDO,TORPEDO,CREW,CREW],
      init: function() {
	  for (var i=0; i<this.weapons.length; i++) {
	      var w=this.weapons[i];
	      if (w.type==TORPEDO) {
		  w.auxiliary=AUXILIARY,
		  w.subauxiliary=SUBAUXILIARY
	      }
	  }
      }
    },
   {
       name:"Baron of the Empire",
       faction:EMPIRE,
       pilotid:184,
       done:true,
       unit:"TIE Adv. Prototype",
       skill:4,
       points:19,
       upgrades:[ELITE,MISSILE]
    },
   {
       name:"Gand Findsman",
       faction:SCUM,
       pilotid:185,
       done:true,
       unit:"G-1A Starfighter",
       skill:5,
       points:25,
       upgrades:[ELITE,CREW,SYSTEM,ILLICIT]
    },
    {
       name:"Ruthless Freelancer",
       faction:SCUM,
       pilotid:186,
       done:true,
       unit:"G-1A Starfighter",
       skill:3,
       points:23,
       upgrades:[CREW,SYSTEM,ILLICIT]
    },
    {
	name:"'Zeta Leader'",
	faction:EMPIRE,
	pilotid:187,
	done:true,
	unique:true,
	unit:"TIE/FO Fighter",
	skill:7,
	points:20,
	upgrades:[ELITE,TECH],
	preattackroll: function(w,t) {
	    var a1={org:this,name:this.name,type:"STRESS",action:function(n) {
		this.log("+1 attack die");
		this.wrap_after("getattackstrength",this,function(i,sh,a){
		    return 1+a;
		}).unwrapper("attackroll");
		this.addstress();
		this.endnoaction(n,"STRESS");
	    }.bind(this)};
	    if (this.stress==0) 
		this.donoaction([a1],"select to add +1 attack roll",true);
	}
    },
    {
	name:"Countess Ryad",
	faction:EMPIRE,
	pilotid:188,
	done:true,
	unique:true,
	unit:"TIE Defender",
	skill:5,
	wave:["aces"],
	points:34,
	shipimg:"tie-defender-red.png",
	upgrades:[ELITE,CANNON,MISSILE],
	init: function() {
	    this.wrap_after("getmaneuverlist",this,function(p) {
		if (this.hasionizationeffect()) return p;
		for (var i=1; i<=5; i++) {
		    if (typeof p["F"+i]!="undefined") {
			p["K"+i]={move:"K"+i,difficulty:p["F"+i].difficulty};
		    }
		}
		return p;
	    });
	}
    },
    {
	name:"'Deathfire'",
	faction:EMPIRE,
	pilotid:189,
	done:true,
	unique:true,
	unit:"TIE Bomber",
	skill:3,
	wave:["aces"],
	points:17,
	upgrades:[TORPEDO,TORPEDO,MISSILE,MISSILE,BOMB],
	init: function() {
	    var i;
	    for (i=0; i<this.upgrades.length; i++) {
		var upg=this.upgrades[i];
		if (typeof upg.action=="function"&&upg.type==BOMB) {
		    upg.wrap_after("canbedropped",this,Bomb.prototype.canbedropped);
		}
	    }
	}
    },
    {
	name:"Rey",
	faction:REBEL,
	pilotid:190,
	done:true,
	unique:true,
        unit: "YT-1300",
        skill: 8,
	wave:["aces"],
        points: 45,
        upgrades: [ELITE,MISSILE,CREW,CREW],
	init: function() {
	    this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    return attacker.isinfiringarc(defender);
		}
	    });
	    this.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["blank"],
		n:function() { return 2; },
		req:function(attacker,w,defender) {
		    return defender.isinfiringarc(attacker);
		}
	    });
	}
    },
    {
        name: "Poe Dameron",
        faction: REBEL,
	pilotid:191,
        unit: "T-70 X-Wing",
	unique:true,
	done:true,
	ambiguous:true,
	edition:"HoR",
	init: poe_fct,
        skill: 9,
	wave:["aces"],
        upgrades: [ELITE,TORPEDO,ASTROMECH,TECH],
	points:33
    },
    {
        name: "'Quickdraw'",
        faction: EMPIRE,
	pilotid:192,
        unit: "TIE/SF Fighter",
	unique:true,
	done:true,
        skill: 9,
        upgrades: [ELITE,SYSTEM,MISSILE,TECH],
	points:29,
	init:function() {
	    this.qdattack=-1;
	    this.addattack(function(c,h) { 
		return this.qdattack<round
	    }, this,[this.weapons[0]],function() {
		this.qdattack=round;
	    },function() {
		return squadron;
	    },"removeshield");
	}
    },
    {
        name: "'Backdraft'",
        faction: EMPIRE,
	pilotid:193,
        unit: "TIE/SF Fighter",
	unique:true,
	done:true,
        skill: 7,
        upgrades: [ELITE,SYSTEM,MISSILE,TECH],
	points:27,
	init: function() {
	    this.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return !targetunit.dead&&this.activeweapon==0&&this.weapons[0].getauxiliarysector(targetunit)<=3;
		}.bind(this),
		f:function(m,n) {
		    this.log("%0 in auxiliary arc -> +1 %CRIT%",targetunit.name);
		    return {m:m+FCH_CRIT,n:n+1};
		}.bind(this),str:"critical"});
	}
    },
    {
        name: "Zeta Specialist",
        faction: EMPIRE,
	pilotid:194,
	done:true,
        unit: "TIE/SF Fighter",
        skill: 3,
        upgrades: [SYSTEM,MISSILE,TECH],
	points:23
    },
    {
        name: "Ketsu Onyo",
        faction: SCUM,
	pilotid:195,
        unit: "Lancer-class Pursuit Craft",
	unique:true,
        skill: 7,
	done:true,
        upgrades: [ELITE,CREW,ILLICIT,ILLICIT],
	points:38,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyenemy(1,function(s,t) { 
		    var w=self.weapons[0];
		    return w.getprimarysector(t)<=3&&w.getauxiliarysector(t)<=3; 
		}),function(p,k) {
		    p[k].log("+1 tractor beam token [%0]",self.name);
		    p[k].addtractorbeam(self);
		},["select unit for tractor beam token [%0]",self.name],false);
	    });
	}
    },
    {
        name: "Asajj Ventress",
        faction: SCUM,
	pilotid:196,
        unit: "Lancer-class Pursuit Craft",
	unique:true,
	done:true,
        skill: 6,
        upgrades: [ELITE,CREW,ILLICIT,ILLICIT],
	points:37,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyenemy(2,function(s,t) { 
		    return self.weapons[0].getauxiliarysector(t)<=3; 
		}),function(p,k) {
		    p[k].log("+1 stress [%0]",self.name);
		    p[k].addstress(self);
		},["select unit [%0]",self.name],false);
	    });	    
	}
    },
    {
        name: "Sabine Wren",
        faction: SCUM,
	pilotid:197,
        unit: "Lancer-class Pursuit Craft",
	unique:true,
	done:true,
        skill: 5,
        upgrades: [CREW,ILLICIT,ILLICIT],
	points:35,
	init: function() {
	    this.adddicemodifier(DEFENSE_M,ADD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return this.weapons[0].getauxiliarysector(activeunit)<=2;
		}.bind(this),
		f:function(m,n) {
		    this.log("Attacker inside Range 1-2 of mobile arc -> +1 %FOCUS%");
		    return {m:m+FE_FOCUS,n:n+1};
		}.bind(this),str:"focus"});
	}
    },
    {
        name: "Shadowport Hunter",
        faction: SCUM,
	pilotid:198,
	done:true,
        unit: "Lancer-class Pursuit Craft",
        skill: 2,
        upgrades: [CREW,ILLICIT,ILLICIT],
	points:33
    },
    {
        name: "Zealous Recruit",
        faction: SCUM,
	pilotid:199,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 1,
        upgrades: [TORPEDO],
	points:20
    },
    {
        name: "Concord Dawn Veteran",
        faction: SCUM,
	pilotid:200,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 3,
        upgrades: [ELITE,TORPEDO],
	points:22
    },
    {
        name: "Concord Dawn Ace",
        faction: SCUM,
	pilotid:201,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 5,
        upgrades: [ELITE,TORPEDO],
	points:23
    },
    {
        name: "Kad Solus",
        faction: SCUM,
	pilotid:202,
	unique:true,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 6,
        upgrades: [ELITE,TORPEDO],
	points:25,
	init: function() {
	    this.wrap_after("handledifficulty",this,function(difficulty) {
		if (difficulty=="RED") {
		    this.addfocustoken(); 
		    this.addfocustoken();
		    this.log("red maneuver -> +2 %FOCUS% [%0]",this.name);
		}
	    });

	}
    },
    {
        name: "Old Teroch",
        faction: SCUM,
	pilotid:203,
	unique:true,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 7,
        upgrades: [ELITE,TORPEDO],
	points:26,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyenemy(1,function(s,t) { 
		    return true; }),
				function(p,k) {
				    var i;
				    var f=p[k].focus;
				    var e=p[k].evade;
				    if (f>0) {
					p[k].log("-%0 %FOCUS% [%1]",f,self.name);
					for (i=0; i<f; i++) p[k].removefocustoken();
				    }
				    if (e>0)  {
					p[k].log("-%0 %EVADE% [%1]",f,self.name);
					for (i=0; i<e; i++) p[k].removeevadetoken();
				    }
				},["select unit [%0]",self.name],false);
	    });
	}
    },
    {
        name: "Fenn Rau",
        faction: SCUM,
	pilotid:204,
	unique:true,
	done:true,
        unit: "Protectorate Starfighter",
        skill: 9,
        upgrades: [ELITE,TORPEDO],
	points:28,
	init: function() {
	    this.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.getrange(sh)==1) {
		    this.log("+1 attack die");
		    return a+1;
		}
		return a;
	    });
	    this.wrap_after("getdefensestrength",this,function(w,sh,a) {
		if (this.getrange(sh)==1) { 
		    this.log("+1 defense die");
		    return a+1;
		}
		return a;
	    });
	}
    },
    {
        name: "Norra Wexley",
        faction: REBEL,
	pilotid:205,
	unique:true,
        unit: "ARC-170",
        skill: 7,
	done:true,
        upgrades: [ELITE,TORPEDO,CREW,ASTROMECH],
	points:29,
        init:  function() {
	    this.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.canusetarget(targetunit);
		}.bind(this),
		f:function(m,n) {
		    this.removetarget(targetunit);
		    this.log("1 %TARGET% -> 1 %FOCUS%");
		    return {m:m+FCH_FOCUS,n:n+1};
		}.bind(this),str:"target"});
	    this.adddicemodifier(DEFENSE_M,ADD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return this.canusetarget(activeunit);
		}.bind(this),
		f:function(m,n) {
		    this.removetarget(activeunit);
		    this.log("1 %TARGET% -> 1 %FOCUS%");
		    return {m:m+FE_FOCUS,n:n+1};
		}.bind(this),str:"target"});
	},   
    },
    {
        name: "Shara Bey",
        faction: REBEL,
	pilotid:206,
	unique:true,
	done:true,
        unit: "ARC-170",
        skill: 6,
        upgrades: [ELITE,TORPEDO,CREW,ASTROMECH],
	points:28,
	init: function() {
	    var self=this;
	  Unit.prototype.wrap_after("canusetarget",self,function(sh,r) {
	      if (self!=this&&self.isally(this)) {
		  if (self.getrange(this)<=2
		  &&self.targeting.indexOf(sh)>-1) {
		  return true;/* TODO incorrect */
		  }
	      }
	      return r;
	  });
	  Unit.prototype.wrap_before("removetarget",self,function(t) {
	      if (self!=this&&self.isally(this)) {
		  if (self.getrange(this)<=2
		      &&this.targeting.indexOf(t)==-1
		      &&self.targeting.indexOf(t)>-1) {
		      self.removetarget(t);
		  }
	      }
	  });
	}
    },
    {
        name: "Thane Kyrell",
        faction: REBEL,
	pilotid:207,
	unique:true,
	done:true,
        unit: "ARC-170",
        skill: 4,
        upgrades: [TORPEDO,CREW,ASTROMECH],
	points:26,
	init: function() {
	    var self=this;
	    Unit.prototype.wrap_after("afterattackeffect",this,function(c,h) {
		if (self!=this
		    &&this.isally(self)
		    &&self.getrange(this)<=3
		    &&self.candoaction()) {
		    self.log("+1 free action [%0]",self.name);
		    self.doaction(self.getactionlist(),"");
		}
	    });
	}
    },
    {
        name: "Braylen Stramm",
        faction: REBEL,
	pilotid:208,
	unique:true,
	done:true,
        unit: "ARC-170",
        skill: 3,
        upgrades: [TORPEDO,CREW,ASTROMECH],
	points:25,
	init: function() {
	    this.wrap_before("endmaneuver",this,function() {
		if (this.stress>0) {
		    var roll=this.rollattackdie(1,this,"hit")[0];
		    if (roll=="hit"||roll=="critical") {
			this.log("-1 stress [%0]",this.name);
			this.removestresstoken();
		    }
		}
	    });
	}
    },
    {
        name: "Omega Specialist",
        faction: EMPIRE,
	pilotid:209,
	done:true,
        unit: "TIE/SF Fighter",
        skill: 5,
        upgrades: [ELITE,SYSTEM,MISSILE,TECH],
	points:25
    },
    {
        name: "Sabine Wren",
        faction: REBEL,
	pilotid:210,
	done:true,
	unique:true,
        unit: "TIE Fighter",
        skill: 5,
	ambiguous:true,
	edition:"TIE Fighter",
        upgrades: [ELITE],
	points:15,
	wave:["10"],
	init: function() {
	    this.wrap_after("beginactivation",this,sabine_fct);
	}
    },
    { name:"Chewbacca",
      unit:"YT-1300",
      skill:5,
      unique:true,
      edition:"HoR",
      wave:["aces"],
      ambiguous:true,
      done:true,
      pilotid:211,
      faction:REBEL,
      upgrades:[ELITE,MISSILE,CREW,CREW],
      points:42,
      init:function() {
	  var self=this;
	  this.addattack(function(c,h,t) { 
	      return c+h<=0&&self.getrange(t)<=3;
	    }, this,this.weapons,function() {
	    },function() {
		return squadron;
	    },"warndeath");
      }
    },
    { name:"Han Solo",
      unit:"YT-1300",
      skill:9,
      done:true,
      unique:true,
      edition:"HoR",
      wave:["aces"],
      ambiguous:true,
      pilotid:212,
      faction:REBEL,
      upgrades:[ELITE,MISSILE,CREW,CREW],
      points:46
    },
    {name:"Nien Nunb",
     unit:"T-70 X-Wing",
     unique:true,
     wave:["aces"],
     done:true,
     pilotid:213,
     faction:REBEL,
     upgrades:[ELITE,TORPEDO,ASTROMECH,TECH],
     init:function() {
	 this.wrap_after("addstress",this,function() {
	     var p=this.selectnearbyenemy(1,function(s,t) {
		 return s.isinprimaryfiringarc(t);
	     });
	     if (p.length>0)  this.removestresstoken();
	 });
     },
     points:29,
     skill:7
    },
    /* TODO: check timing */
    {name:"'Snap' Wexley",
     unit:"T-70 X-Wing",
     unique:true,
     done:true,
     pilotid:214,
     faction:REBEL,
     upgrades:[ELITE,TORPEDO,ASTROMECH,TECH],
     points:28,
     wave:["aces"],
     skill:6,
     init:function() {
	 this.wrap_before("endmaneuver",this,function() {
	     var p=this.moves;
	     for (i in p) {
		 var m=p[i].move;
		 if (m.match(/\w+[234]/)&&!this.collision&&this.candoboost()) {
		     this.doaction([this.newaction(this.resolveboost,"BOOST")],"free %BOOST%");
		 }
	     }
	 });
	 
     }
    },
    {name:"Jess Pava",
     unit:"T-70 X-Wing",
     unique:true,
     done:true,
     pilotid:215,
     faction:REBEL,
     upgrades:[ELITE,TORPEDO,ASTROMECH,TECH],
     points:25,
     skill:3,
     wave:["aces"],
     init: function() {
	 var self=this;
	 var f=function() {
	     return self.selectnearbyally(1,function(s,t) { return s!=t; }).length;
	 };
	 this.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
	     dice:["blank","focus"],
	     n:f,
	     req:function(attack,w,defender) { return true; }
	 });
	 this.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
	     dice:["blank","focus"],
	     n:f,
	     req:function(attack,w,defender) { return true; }
	 });
     }
    },
    {
        name: "Ahsoka Tano",
        faction: REBEL,
	pilotid:216,
	unique:true,
        unit: "TIE Fighter",
        skill: 7,
        upgrades: [ELITE],
	points:17,
	wave:["10"],
	done:true,
	init: function() {
	    var self=this;
	    this.wrap_before("begincombatphase",this,function() {
		if (this.canusefocus()) {
		    var p=this.selectnearbyally(1);
		    p.push(this);
		    this.selectunit(p,function(p,k) {
			if (p[k]!=self) {
			    self.removefocustoken();
			    p[k].log("+1 free action [%0]",self.name);
			    p[k].doaction(p[k].getactionlist(),"");
			}
		    },["select unit, self to cancel [%0]",self.name],false);
		}
	    });
	}
    },    
    {
        name: "Captain Rex",
        faction: REBEL,
	pilotid:217,
	unique:true,
	done:true,
        unit: "TIE Fighter",
        skill: 4,
	wave:["10"],
        upgrades: [ELITE],
	points:14,
	init: function() {
	    this.wrap_after("endattack",this,function(c,h,t) {
		c=new Condition(t,this,"Suppressive Fire");
	    });
	}
    },  
    {
	name:"Constable Zuvio",
	faction:SCUM,
	pilotid:218,
	unique:true,
	unit:"Quadjumper",
	skill:7,
	upgrades:[ELITE,CREW,BOMB,TECH,ILLICIT],
	points:19,
	done:true,
	init: function() {
	    /* when you reveal a reverse maneuver */
	    this.wrap_after("getbombposition",this,function(lm,size,p) {
		var m=this.maneuver;
		if (this.getdial()[m].move.match(/R/)) {
		    for (var i=0; i<lm.length; i++)
			p.push(this.getpathmatrix(this.m.clone(),lm[i]).translate(0,-size+20));
		}
		return p;
	    });
	    for (var i=0; i<this.bombs.length; i++) {
		var b=this.bombs[i];
		b.wrap_after("canbedropped",this,function(b) { 
		    var u=this.unit;
		    return b||this.unit.getdial()[this.unit.maneuver].move.match(/R/); 
		});
	    }
	}
    },
    { name:"Unkar Plutt",
      faction:SCUM,
      pilotid:219,
      unique:true,
      unit:"Quadjumper",
      skill:3,
      upgrades:[CREW,BOMB,TECH,ILLICIT],
      points:17,
      done:true,
      init: function() {
	  this.wrap_after("endactivationphase",this,function() {
	      for (var i in this.touching) {
		  var u=this.touching[i];
		  this.log("+1 tractor beam for %0",u.name);
		  u.addtractorbeam(this);
	      }
	  });
      }
    },
    { name:"Jakku Gunrunner",
      faction:SCUM,
      pilotid:220,
      done:true,
      unit:"Quadjumper",
      skill:1,
      upgrades:[CREW,BOMB,TECH,ILLICIT],
      points:15
    },
    { name:"Heff Tobber",
      faction:REBEL,
      pilotid:221,
      unique:true,
      unit:"U-Wing",
      skill:3,
      upgrades:[SYSTEM,TORPEDO,CREW,CREW],
      points:24,
      done:true,
      init:function() {
	  this.wrap_after("collidedby",this,function(u) {
	      this.doaction(this.getactionlist(),"");
	  });
      }
    },
    { name:"Blue Squadron Pathfinder",
      faction:REBEL,
      pilotid:222,
      unit:"U-Wing",
      done:true,
      skill:2,
      upgrades:[SYSTEM,TORPEDO,CREW,CREW],
      points:23
    },
    { name:"Bodhi Rook",
      faction:REBEL,
      unique:true,
      pilotid:223,
      unit:"U-Wing",
      skill:4,
      done:true,
      upgrades:[SYSTEM,TORPEDO,CREW,CREW],
      points:25,
      init: function() {
	  var self=this;
	  Unit.prototype.wrap_after("gettargetableunits",this,function(r,t) {
	      if (self.isally(this)) {
		  var p=[];
		  for (var i in squadron) {
		      var u=squadron[i];
		      if (u.isally(self)) p=p.concat(Unit.prototype.gettargetableunits.vanilla.call(u,3));
		  }
		  return p;
	      } 
	      return t;
	  });
      }
    },
    { name:"'Duchess'",
      faction:EMPIRE,
      unique:true,
      done:true,
      pilotid:224,
      unit:"TIE Striker",
      skill:8,
      upgrades:[ELITE],
      points:23,
      init: function() {
	  this.facultativeailerons=true;
      }
    },
    { name:"'Countdown'",
      faction:EMPIRE,
      unique:true,
      pilotid:225,
      unit:"TIE Striker",
      skill:5,
      upgrades:[],
      done:true,
      points:20,
      init: function() {
	    this.adddicemodifier(ATTACKCOMPARE_M,ADD_M,DEFENSE_M,this,{
		req:function(m,n) { return this.stress==0&&n>0; }.bind(this),
		f:function(m,n) {
		    if (this.stress==0) {
			this.log("cancel all dice results");
			this.applydamage(1);
			this.addstress();
			return {m:0,n:0};
		    } else return {m:m,n:n};
		}.bind(this),str:"hit"});

      }
    },
    { name:"'Pure Sabacc'",
      faction:EMPIRE,
      unique:true,
      pilotid:226,
      unit:"TIE Striker",
      skill:6,
      upgrades:[ELITE],
      points:22,
      done:true,
      init: function() {
	  this.wrap_after("getattackstrength",this,function(i,t,a) {
	      if (this.criticals.length<=1) return a+1;
	      return a;
	  });
      }
    },
    { name:"Imperial Trainee",
      faction:EMPIRE,
      pilotid:227,
      done:true,
      unit:"TIE Striker",
      skill:1,
      upgrades:[],
      points:17
    },
    { name:"Black Squadron Scout",
      faction:EMPIRE,
      pilotid:228,
      done:true,
      unit:"TIE Striker",
      skill:4,
      upgrades:[ELITE],
      points:20
    },
    { name:"Scarif Defender",
      faction:EMPIRE,
      pilotid:229,
      done:true,
      unit:"TIE Striker",
      skill:3,
      upgrades:[],
      points:18
    },
    { name:"Cassian Andor",
      faction:REBEL,
      pilotid:230,
      unit:"U-Wing",
      skill:6,
      unique:true,
      done:true,
      upgrades:[ELITE,SYSTEM,TORPEDO,CREW,CREW],
      points:27,
      init: function() {
	  var self=this;
	  this.wrap_after("beginactivationphase",this,function(l) {
	      var p=this.selectnearbyally(2,function(s,t) {
		  if (t.stress>0) return true; else return false; 
	      });
	      if (p.length>0) {
		  this.doselection(function(n) {
		      this.log("select unit for -1 stress");
		      this.resolveactionselection(p,function(k) {
			  p[k].removestresstoken();
			  self.endnoaction(n);
		      });
		  }.bind(this));
	      }
	      return l;
	  });
      }
    },
    {name:"Kylo Ren",
     faction:EMPIRE,
     pilotid:231,
     unique:true,
     unit:"Upsilon-class Shuttle",
     skill:6,
     done:true,
     upgrades:[ELITE,SYSTEM,CREW,CREW,TECH,TECH],
     points:34,
     init: function() {
	 this.firstroundhit=-1;
	 this.wrap_after("resolveishit",this,function(t) {
	     if (this.firstroundhit<round) {
		 this.firstroundhit=round;
		 c=new Condition(t,this,"I'll Show You The Dark Side");
	     }
	 });
     }
    },
    {name:"Major Stridan",
     faction:EMPIRE,
     pilotid:232,
     unique:true,
     done:true,
     unit:"Upsilon-class Shuttle",
     skill:4,
     upgrades:[SYSTEM,CREW,CREW,TECH,TECH],
     points:32,
     init: function() {
	 this.wrap_after("selectnearbyally",this,function(r,f,t) {
	     if (typeof t=="undefined") { t=f; f=undefined; }
	     if (r>1) return t;
	     var t2 = Unit.prototype.selectnearbyally.call(this,3,f);
	     return t2;
	 });
     }
    },
   {name:"Lieutenant Dormitz",
     faction:EMPIRE,
     pilotid:233,
    unique:true,
    done:true,
     unit:"Upsilon-class Shuttle",
     skill:3,
     upgrades:[SYSTEM,CREW,CREW,TECH,TECH],
     points:31
    },
   {name:"Starkiller Base Pilot",
     faction:EMPIRE,
     pilotid:234,
    done:true,
     unit:"Upsilon-class Shuttle",
     skill:2,
     upgrades:[SYSTEM,CREW,CREW,TECH,TECH],
     points:30
    },
    {
        name: "'Zeb' Orrelios",
        faction: REBEL,
	pilotid:235,
	unique:true,
	done:true,
	ambiguous:true,
	edition:"TIE Fighter",
        unit: "TIE Fighter",
        skill: 3,
	wave:["10"],
        upgrades: [],
	points:13,
	cancelhit:zeb_fct
    },  
    { 
	name: "Resistance Sympathizer",
	faction:REBEL,
	pilotid:236,
	done:true,
	unit:"YT-1300",
	skill:3,
	wave:["aces"],
	upgrades:[MISSILE,CREW,CREW],
	points:38
    },
    { 
	name: "Sarco Plank",
	faction:SCUM,
	pilotid:237,
	done:true,
	unique:true,
	unit:"Quadjumper",
	skill:5,
	upgrades:[ELITE,CREW,BOMB,TECH,ILLICIT],
	points:18,
	init: function() {
	    var self=this;
	    this.wrap_after("getdefensestrength",this,function(i,sh,d) {
		var s=0;
		var a=this.getagility();
		if (this.lastmaneuver>=0) 
		    s=P[this.getdial()[this.lastmaneuver].move].speed;
		console.log("agility +-"+a+" "+s);
		if (a<s)  d=d-a+s;
		return d;
	    });
	}
   },
   { name:"Inaldra",
     faction:SCUM,
     pilotid:238,
     unique:true,
     unit:"M3-A Interceptor",
     skill:3,
     wave:["epic"],
     upgrades:[ELITE],
     points:15
   },
   { name:"Genesis Red",
     faction:SCUM,
     pilotid:239,
     unique:true,
     unit:"M3-A Interceptor",
     skill:7,
     wave:["epic"],
     upgrades:[ELITE],
     points:19
   },
   { name:"Sunny Bounder",
     faction:SCUM,
     pilotid:240,
     unique:true,
     unit:"M3-A Interceptor",
     skill:1,
     wave:["epic"],
     upgrades:[],
     points:14
   },
   { name:"Quinn Jast",
     faction:SCUM,
     pilotid:241,
     unique:true,
     wave:["epic"],
     unit:"M3-A Interceptor",
     skill:6,
     upgrades:[ELITE],
     points:18
   },

];

})();
/* 31/06/15: XW FAQ with Garven Dreis 
TODO: desactivate  and unwrapping.
Unit.prototype for old pilots and upgrades
*/

const UPGRADE_TYPES={
    Elite:"ept",Torpedo:TORPEDO,Astromech:"amd",Turret:"turret",Missile:"missile",Crew:"crew",Cannon:"cannon",Bomb:"bomb",Title:"title",Mod:"mod",System:"system",Illicit:"illicit",Salvaged:"salvaged",Tech:"tech"
};
function AUXILIARY(i,m) { return this.getPrimarySectorString(i,m.clone().rotate(this.arcrotation,0,0));};
function SUBAUXILIARY(i,j,m) { return this.getPrimarySubSectorString(i,j,m.clone().rotate(this.arcrotation,0,0)); }
function Laser(u,type,fire) {
    switch(type) {
    case "Bilaser":
    case "Mobilelaser":
	return new Weapon(u,{
	    type: type,
	    name:"Laser",
	    isactive:true,
	    attack: fire,
	    range: [1,3],
	    isprimary: true,
	    issecondary:false,
	    auxiliary: AUXILIARY,
	    subauxiliary: SUBAUXILIARY
	});
    case "Laser180":
	return new Weapon(u,{
	    type: type,
	    name:"Laser",
	    isactive:true,
	    attack: fire,
	    range: [1,3],
	    isprimary: true,
	    issecondary:false,
	    auxiliary: function(i,m) { return this.getHalfRangeString(i,m); },
	    subauxiliary: function(i,j,m) { return this.getHalfSubRangeString(i,j,m); }
	});	
    default: return new Weapon(u,{
	type: type,
	name:"Laser",
	isactive:true,
	attack: fire,
	range: [1,3],
	isprimary: true,
	issecondary:false
    });
    }
}
function Bomb(sh,bdesc) {
    $.extend(this,bdesc);
    sh.upgrades.push(this);
    this.isactive=true;
    this.wrapping=[];
    this.unit=sh;
    sh.bombs.push(this);
    this.exploded=false;
    //if (this.init != undefined) this.init(sh);
};
Bomb.prototype = {
    isWeapon() { return false; },
    isBomb() { return true; },
    canbedropped() { return this.isactive&&!this.unit.hasmoved&&this.unit.lastdrop!=round; },
    desactivate() { this.isactive=false;this.unit.movelog("D-"+this.unit.upgrades.indexOf(this)); },
    getBall() {
	var b=this.g.getBBox();
	return {x:b.x+b.width/2,y:b.y+b.height/2,diam:Math.max(b.width/2,b.height/2)};
    },
    actiondrop(n) {
	this.unit.lastdrop=round;
	$(".bombs").remove(); 
	this.drop(this.unit.getbomblocation(),n);
	//this.unit.showactivation();
    },
    toString() {
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	return Mustache.render(TEMPLATES["bomb"], this);
    },
    getrangeallunits() { 
	var range=[[],[],[],[],[]],i;
	for (i in squadron) {
	    var sh=squadron[i];
	    var k=this.getrange(sh);
	    if (k>0) range[k].push({unit:i});
	};
	return range;
    },
    getcollisions() {
	var ob=this.getOutlineString();
	var p=[];
	for (var i in squadron) {
	    var u=squadron[i];
	    var so=u.getOutlineString(u.m);
	    var os=so.s;
	    var op=so.p;
	    if (Snap.path.intersection(ob.s,os).length>0 
		||this.unit.isPointInside(ob.s,op)
		||this.unit.isPointInside(os,ob.p)) {
		p.push(u); 
	    }

	}
	return p;
    },
    getrange(sh) { 
	var ro=this.getOutlineString(this.m).p;
	var rsh = sh.getOutlinePoints(sh.m);
	var min=90001;
	var i,j;
	var mini,minj;
	for (i=0; i<ro.length; i++) {
	    for (j=0; j<4; j++) {
		var d=dist(rsh[j],ro[i]);
		if (d<min) min=d;
	    }
	}
	if (min>90000) return 4;
	if (min<=10000) return 1; 
	if (min<=40000) return 2;
	return 3;
    },
    resolveactionmove(moves,cleanup) {
	var i;
	this.pos=[];
	var ready=false;
	var resolve=function(m,k,f) {
	    for (i=0; i<moves.length; i++) this.pos[i].remove();
	    this.m=m;
	    f(this,k);
	}.bind(this);
	if (moves.length==1) {
	    this.pos[0]=this.getOutline(moves[0]).attr({fill:this.unit.color,opacity:0.7});
	    resolve(moves[0],0,cleanup);
	} else {
	    for (i=0; i<moves.length; i++) {
		this.pos[i]=this.getOutline(moves[i]).attr({fill:this.unit.color,opacity:0.7});
		(function(k) {
		    this.pos[k].hover(
			function() {this.pos[k].attr({stroke:this.unit.color,strokeWidth:"4px"});}.bind(this),
			function() {this.pos[k].attr({strokeWidth:"0"});}.bind(this));
		
		    this.pos[k].click(
		    function() { resolve(moves[k],k,cleanup); });}.bind(this)
		)(i);
	    }
	}
    },
    drop(lm,n) {
	var dropped=this;
	if (this.ordnance) { 
	    this.ordnance=false; 
	    dropped=$.extend({},this);
	} else this.desactivate();
	dropped.resolveactionmove(this.unit.getbombposition(lm,this.size), function(k) {
	    this.display(0,0);
	    this.unit.bombdropped(this);
	    //this.unit.log("endaction dropped "+n);
	    if (typeof n!="undefined") this.unit.endnoaction(n,"DROP");
	}.bind(dropped),false,true);
    },
    display(x,y) {
	if (x!=0||y!=0) this.m=this.m.clone().translate(x,y);
	this.img1=s.image("png/"+this.img,-this.width/2,-this.height/2,this.width,this.height);
	this.outline=this.getOutline(new Snap.Matrix())
	    .attr({display:"block","class":"bombanim",stroke:halftone(BLUE),strokeWidth:2,fill:"rgba(8,8,8,0.3)"});
	this.g=s.group(this.outline,this.img1);
	this.g.hover(function () { 
	    var m=VIEWPORT.m.clone();
	    var w=$("#svgout").width();
	    var h=$("#svgout").height();
	    var startX=0;
	    var startY=0;
	    if (h>w) startY=(h-w)/2;
	    else startX=(w-h)/2;
	    var max=Math.max(900./w,900./h);
	    
	    var bbox=this.g.getBBox();
	    var p=$("#svgout").position();
	    var min=Math.min($("#playmat").width(),$("#playmat").height());
	    var x=m.x(bbox.x,bbox.y-20)/max;
	    x+=p.left+startX;
	    var y=m.y(bbox.x,bbox.y-20)/max;
	    y+=p.top+startY;
	    this.outline.attr({stroke:BLUE});
	    $(".info").css({left:x,top:y}).html(this.name).appendTo("body").show();
	}.bind(this), function() { 
	    $(".info").hide(); 
	    this.outline.attr({stroke:halftone(BLUE)});
	}.bind(this));
	this.g.transform(this.m);
	this.g.appendTo(VIEWPORT);
	this.g.attr("display","block");
	BOMBS.push(this);
	if (this.stay) {
	    OBSTACLES.push(this);
	    var p=this.getcollisions();
	    if (p.length>0) this.unit.resolveactionselection(p,function(k) {
		this.detonate(p[k],true);
	    }.bind(this));
	}
    },
    getOutline(m) {
	return s.path(this.getOutlineString(m).s).appendTo(VIEWPORT);
    },
    getOutlineString(m) {
	var w=15;
	if (typeof m=="undefined") m=this.m;
	var p1=transformPoint(m,{x:-w-1,y:-w});
	var p2=transformPoint(m,{x:w+1,y:-w});
	var p3=transformPoint(m,{x:w+1,y:w});
	var p4=transformPoint(m,{x:-w-1,y:w});	
	this.op=[p1,p2,p3,p4];
	var p=this.op;
	return {s:"M "+p[0].x+" "+p[0].y+" L "+p[1].x+" "+p[1].y+" "+p[2].x+" "+p[2].y+" "+p[3].x+" "+p[3].y+" Z",p:p}; 
    },
    explode_base() {
	this.exploded=true;
	this.unit.log("%0 explodes",this.name);
	SOUNDS[this.snd].play();
	this.g.remove();
	BOMBS.splice(BOMBS.indexOf(this),1);
    },
    explode() { this.explode_base(); },
    detonate(t,immediate) {
	OBSTACLES.splice(OBSTACLES.indexOf(this),1);
	this.explode_base();
    },
    endround() {},
    show() {},
    wrap_before: Unit.prototype.wrap_before,
    wrap_after:Unit.prototype.wrap_after
};
function Weapon(sh,wdesc) {
    this.isprimary=false;
    this.issecondary=true;
    $.extend(this,wdesc);
    sh.upgrades[sh.upgrades.length]=this;
    this.wrapping=[];
    this.ordnance=false;
    //log("Installing weapon "+this.name+" ["+this.type+"]");
    this.isactive=true;
    this.unit=sh;
    sh.weapons.push(this);
};
Weapon.prototype = {
    isBomb() { return false; },
    isWeapon() { return true; },
    desactivate() {
	if (this.ordnance&&this.type.match(/Torpedo|Missile/)) {
	    this.ordnance=false;
	} else { this.isactive=false; /*this.unit.movelog("D-"+this.unit.upgrades.indexOf(this)); this.unit.show();*/ }
    },
    toString() {
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	if (this.isactive) {
	    var i,r=this.getrangeallunits();
	    for (i=0; i<r.length; i++) if (r[i].isenemy(this.unit)) break;
	    if (i==r.length) this.nofire=true; else this.nofire=false;
	}
	this.attackkey=A[this.type.toUpperCase()].key;
	this.req=[];
	if ((typeof this.getrequirements()!="undefined")) {
	    if ("Target".match(this.getrequirements())) this.req.push([A["TARGET"].key]);
	    if ("Focus".match(this.getrequirements())) this.req.push(A["FOCUS"].key);
	}
	this.uid = squadron.indexOf(this.unit);
	this.rank=this.unit.upgrades.indexOf(this);
	return Mustache.render(TEMPLATES["weapon"], this);
    },
    prehit(t,c,h) {},
    posthit(t,c,h) {},
    getrequirements() {
	return this.requires;
    },
    getattack() {
	return this.attack;
    },
    isTurret() {
	return this.type==TURRET;
    },
    getlowrange() {
	return this.range[0];
    },
    gethighrange() {
	return this.range[1];
    },
    isinrange(r) {
	return (r>=this.getlowrange()&&r<=this.gethighrange());
    },
    modifydamagegiven(ch) { return ch; },
    modifyattackroll(ch,n,d) { return ch; },
    modifydamageassigned(ch,t) { return ch; },
    canfire(sh) {
	if (typeof sh=="undefined") {
	    return true;
	}
	if (!this.isactive||this.unit.isally(sh)) return false;
	if (this.unit.checkcollision(sh)) return false;
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    if (s.match(this.getrequirements())&&this.unit.canusetarget(sh))
		return true;
	    s="Focus";
	    if (s.match(this.getrequirements())&&this.unit.canusefocus(sh)) return true;
	    return false;
	}
	return true;
    },
    getrangeattackbonus(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==1) {
		this.unit.log("+1 attack for range 1");
		return 1;
	    }
	}
	return 0;
    },
    declareattack(sh) { 
	if (typeof this.getrequirements()!="undefined") {
	    var s="Target";
	    var u="Focus";
	    if (s.match(this.getrequirements())&&this.consumes==true&&this.unit.canusetarget(sh))
		this.unit.removetarget(sh);
	    else if (u.match(this.getrequirements())&&this.consumes==true&&this.unit.canusefocus(sh)) 
		this.unit.removefocustoken();
	    this.unit.show();
	}
	return true;
    },
    getrangedefensebonus(sh) {
	if (this.isprimary) {
	    var r=this.getrange(sh);
	    if (r==3) {
		sh.log("+1 defense for range 3");
		return 1;
	    }
	}
	return 0;
    },
    getauxiliarysector(sh) {
	var m=this.unit.m;
	if (typeof this.auxiliary=="undefined") return 4;
	var n=this.unit.getoutlinerange(m,sh).d;
	for (var i=n; i<=n+1&&i<=3; i++) 
	    if (this.unit.isinsector(m,i,sh,this.subauxiliary,this.auxiliary)) return i;
	return 4;
    },
    getprimarysector(sh) {
	var m=this.unit.m;
	var n=this.unit.getoutlinerange(m,sh).d;
	for (var i=n; i<=n+1&&i<=3; i++) 
	    if (this.unit.isinsector(m,i,sh,this.unit.getPrimarySubSectorString,this.unit.getPrimarySectorString)) return i;
	return 4;
    },
    getsector(sh) {
	var m=this.unit.m;
	var n=this.unit.getoutlinerange(m,sh).d;
	for (var i=n; i<=n+1&&i<=3; i++) 
	    if (this.unit.isinsector(m,i,sh,this.unit.getPrimarySubSectorString,this.unit.getPrimarySectorString)) return i;
	if (typeof this.auxiliary=="undefined") return 4;
	for (var i=n; i<=n+1&&i<=3; i++) 
	    if (this.unit.isinsector(m,i,sh,this.subauxiliary,this.auxiliary)) return i;
	return 4;
    },
    getrange(sh) {
	var i;
	if (!this.canfire(sh)) return 0;
	if (this.isTurret()||this.unit.isTurret(this)) {
	    var r=this.unit.getrange(sh);
	    if (this.isinrange(r)) return r;
	    else return 0;
	}
	var ghs=this.getsector(sh);
	if (ghs>=this.getlowrange()&&ghs<=this.gethighrange()) return ghs;
	return 0;
    },
    endattack(c,h) {
	if (this.type.match(/Torpedo|Missile/)) this.desactivate();
    },
    hasdoubleattack() { return false; },
    hasenemiesinrange() {
	for (var i in squadron) {
	    var sh=squadron[i];
	    if (this.unit.isenemy(sh)&&this.getrange(sh)>0) return true;
	}
	return false;
    },
    getenemiesinrange(enemylist) {
	var r=[];
	if (typeof enemylist=="undefined") enemylist=squadron;
	for (var i in enemylist) {
	    var sh=enemylist[i];
	    if (sh.isenemy(this.unit)&&this.getrange(sh)>0) r.push(sh);
	}
	return r;
    },
    getrangeallunits() {
	var i;
	var r=[];
	for (i in squadron) {
	    var sh=squadron[i];
	    if ((this.unit!=sh)&&(this.getrange(sh)>0)) r.push(sh);
	}
	return r;
    },
    wrap_before:Unit.prototype.wrap_before,
    wrap_after:Unit.prototype.wrap_after,
    endround() {},
    show() {}
};
function Upgradefromid(sh,i) {
    var upg=UPGRADES[i];
    upg.id=i;
    if (upg.type==BOMB) return new Bomb(sh,upg);
    if (typeof upg.isWeapon != "undefined") { 
	if (upg.isWeapon()) return new Weapon(sh,upg);
	else return new Upgrade(sh,i);
    }
    if (upg.type.match(/Turretlaser|Bilaser|Mobilelaser|Laser180|Laser|Torpedo|Cannon|Missile|Turret/)||upg.isweapon==true) return new Weapon(sh,upg);
    return new Upgrade(sh,i);
}
function Upgrade (sh,i) {
    $.extend(this,UPGRADES[i]);
    sh.upgrades.push(this);
    this.isactive=true;
    this.unit=sh;
    this.wrapping=[];
    /*
     var addedaction=this.addedaction;
     if (typeof addedaction!="undefined") {
     var added=addedaction.toUpperCase();
     sh.shipactionList.push(added);
     }
     */
    //if (typeof this.init != "undefined") this.init(sh);
};
Upgrade.prototype = {
    toString() {
	this.tooltip = formatstring(getupgtxttranslation(this.name,this.type));
	this.trname=translate(this.name).replace(/\'/g,"&#39;");
	this.left=(this.unit.team==1);
	if (typeof this.shield!="undefined" &&this.shield>0) this.hasshield=true; else this.hasshield=false;
	if (typeof this.focus!="undefined" &&this.focus>0) this.hasfocus=true; else this.hasfocus=false;
	if (typeof this.switch!="undefined"&&this.canswitch()) {
	    for (var j=0; j<this.unit.upgrades.length; j++) if (this.unit.upgrades[j]==this) break;
	    this.hasswitch={uid:this.unit.id,uuid:j};
	} else this.hasswitch=false;
	return Mustache.render(TEMPLATES["upgrade"], this);
    },
    isWeapon() { return false; },
    isBomb() { return false; },
    getlowrange() {
	return this.range[0];
    },
    gethighrange() {
	return this.range[1];
    },
    endround() {},
    desactivate() {
	if (this.ordnance&&this.type.match(/Torpedo|Missile/)) {
	    this.ordnance=false;
	} else { this.isactive=false; this.unit.movelog("D-"+this.unit.upgrades.indexOf(this)); this.unit.show(); }
    },
    show() {},
    install(sh) {
	if (typeof this.addedaction!="undefined") {
	    var aa=this.addedaction.toUpperCase();
	    sh["addedaction"+this.id]=sh.shipactionList.length;
	    sh.shipactionList.push(aa);
	    sh.showactionlist();
	}
	// Adding upgrades
	if (typeof this.upgrades!="undefined") {
	    sh["addedupg"+this.id]=sh.upgradesno;
	    if (typeof this.pointsupg!="undefined") sh.upgbonus[this.upgrades[0]]=this.pointsupg;
	    if (typeof this.maxupg!="undefined") {
		sh.maxupg[this.upgrades[0]]=this.maxupg;
	    }
	    if (this.exclusive==true) {
		sh.exclupg[this.upgrades[0]]=true;
	    }
	    sh.upgradetype=sh.upgradetype.concat(this.upgrades);
	    sh.upgradesno=sh.upgradetype.length;
	    sh.showupgradeadd();   
	}
	// Losing upgrades
	if (typeof this.lostupgrades!="undefined") {
	    for (var j=0; j<sh.upgradetype.length; j++) {
		if (this.lostupgrades.indexOf(sh.upgradetype[j])>-1) {
		    if (sh.upg[j]>-1) removeupgrade(sh,j,sh.upg[j]);
		    sh.upg[j]=-2;
		}
	    }
	    sh.showupgradeadd();
	}
	// Emperor
	if (typeof this.takesdouble!="undefined") {
	    var j;
	    for (j=0; j<sh.upgradetype.length; j++){
		if (sh.upgradetype[j]==this.type&&(sh.upg[j]<0||UPGRADES[sh.upg[j]].name!=this.name)) {
		    break;
		}
	    }
	    if (j<sh.upgradetype.length) {
		if (sh.upg[j]>-1) removeupgrade(sh,j,sh.upg[j]);
		sh.upg[j]=-2;
	    }
	    sh.showupgradeadd();
	}
    },
    uninstall(sh) {
	var i;
	//sh.log("removing upgrade "+this.name);
	if (typeof this.addedaction!="undefined") {
	    var aa=this.addedaction.toUpperCase();
	    sh.shipactionList.splice(sh["addedaction"+this.id],1);

	}
	if (typeof this.upgrades!="undefined") {
	    if (typeof this.pointsupg!="undefined") sh.upgbonus[this.upgrades[0]]=0;
	    if (typeof this.maxupg!="undefined") sh.maxupg[this.upgrades[0]]=0;
	    for (i=0; i<this.upgrades.length; i++) {
		var num=i+sh["addedupg"+this.id];
		var e=$("#unit"+sh.id+" .upg div[num="+num+"]");
		if (e.length>0) {
		    var data=e.attr("data");
		    removeupgrade(sh,num,data);
		}
	    }
	    if (typeof this.exclusive==true) {
		sh.exclupg[this.upgrades[0]]=false;
	    }
	    sh.upgradetype.splice(sh["addedupg"+this.id],this.upgrades.length);
	    sh.upgradesno=sh.upgradetype.length;
	}
	if (typeof this.lostupgrades!="undefined") {
	    for (i=0; i<sh.upgradetype.length; i++)
		if (this.lostupgrades.indexOf(sh.upgradetype[i])>-1)
		    sh.upg[i]=-1;
	}
	if (typeof this.takesdouble!="undefined") {
	    for (i=0; i<sh.upgradetype.length; i++)
		if (sh.upgradetype[i]==this.type&&sh.upg[i]==-2)
		    sh.upg[i]=-1;
	}
    },
    wrap_before:Unit.prototype.wrap_before,
    wrap_after:Unit.prototype.wrap_after
};

/* TODO: 
   add afterattack effect */
window.UPGRADES= [
    {
	name: "Ion Cannon Turret",
	type: TURRET,
	firesnd:"falcon_fire",
	points: 5,
	attack: 3,
	upgid:0,
	done:true,
	modifyhit: function(ch) { return FCH_HIT; },
	prehit: function(target,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
	    target.addiontoken();
	},
	range: [1,2]
    },
    {
	name: "Proton Torpedoes",
	requires: "Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
        points: 4,
	done:true,
        attack: 4,
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (sh.weapons[sh.activeweapon]==this);
		}.bind(this),
		aiactivate: function(m,n) { return FCH_focus(m)>0;},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",this.name);
			m=m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(this),str:"focus"});
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},        
        range: [2,3]
    },
    {
        name: "R2 Astromech",
	done:true,
        install: function(sh) {
	    var i;
	    var self=this;
	    var save=[];
	    sh.installed=true;
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) { 
		    for (i=0; i<gd.length; i++) {
			var s=P[gd[i].move].speed;
			var d=gd[i].difficulty;
			if (s==1||s==2) d="GREEN"; 
			save[i]={move:gd[i].move,difficulty:d};
		    }
		    this.log("1, 2 speed maneuvers are green [%0]",self.name);
		}
		return save;
	    });
	},
	uninstall:function(sh) {
	    if (typeof sh.getdial.unwrap=="function") 
		sh.getdial.unwrap(this);
	},
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "R2-D2",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		if (d=="GREEN"&&this.shield<this.ship.shield){ 
		    this.addshield(1);
		    this.log("+1 %SHIELD% [%0]",self.name);
		}
	    });
	},
        unique: true,
        type: ASTROMECH,
        points: 4
    },
    {
        name: "R2-F2",
        done:true,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    if (this.isactive) {
		this.unit.log("+1 agility until end of round [%0]",self.name);
		self.wrap_after("getagility",this,function(a) {
		    return a+1;
		}).unwrapper("endphase");
		self.showstats();
	    }
	    self.endaction(n,ASTROMECH);
	    return true;
	},
        unique: true,
        type: ASTROMECH,
        points: 3
    },
    {
        name: "R5-D8",
	done:true,
        candoaction: function() {
	    if (!this.isactive) return false;
	    for (var i=0; i<this.unit.criticals.length; i++) 
		if (this.unit.criticals[i].isactive==false) return true;
	    return false;
	},
	action: function(n) {
	    var self=this;
	    if (!this.isactive) {
		this.unit.defenseroll(1).done(function(roll) {
		    if (FE_evade(roll.roll)+FE_focus(roll.roll)>0) {
			for (var i=0; i<this.criticals.length; i++)
			    if (this.criticals[i].isactive==false) {
				this.log("-1 %HIT% [%0]",self.name);
				this.criticals.slice(i,1);
				this.addhull(1);
				this.show();
				break;
			}
		    }
		    this.endaction(n,ASTROMECH);
		}.bind(this.unit));
	    } else this.unit.endaction(n,ASTROMECH);
	},
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    { name: "R5-X3",
      unique:true,
      type:ASTROMECH,
      points:1,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("updateactivationdial",this,function() {
	      this.addactivationdial(function() { 
		  return !this.hasionizationeffect()&&self.isactive;
	      }.bind(this),function() {
		  this.log("ignore obstacles [%0]",self.name);
		  self.desactivate();
		  this.wrap_after("hascollidedobstacle",self,function(b) { 
		      return false;
		  }).unwrapper("endphase");
		  this.wrap_after("isfireobstructed",this,function() { return false; }).unwrapper("endphase");
		  this.wrap_after("getobstructiondef",this,function() { return 0; }).unwrapper("endphase");
		  this.show();
	      }.bind(this), A[ASTROMECH.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
	      return this.activationdial;
	  });
      },
    },
    { name: "BB-8",
      unique:true,
      done:true,
      type:ASTROMECH,
      points:2,
      init: function(sh) {
	  var self=this;
	  self.bb=-1;
	  sh.wrap_after("updateactivationdial",this,function(ad) {
	      if (self.isactive&&self.bb!=round&&!this.hasionizationeffect()) 
		  this.addactivationdial(
		      function() { 
			  return !this.hasmoved&&this.maneuver>-1&&(this.getmaneuver().difficulty=="GREEN")&&this.candoroll()&&!this.hasionizationeffect(); 
		      }.bind(this),
		      function() {
			  self.bb=round;
			  this.doaction([this.newaction(this.resolveroll,"ROLL")],self.name+" free roll for green maneuver.");
		      }.bind(this), 
		      A[ASTROMECH.toUpperCase()].key, 
		      $("<div>").attr({class:"symbols",title:self.name}));
	      return this.activationdial;
	  })
      },
    },
    {name:"Integrated Astromech",
     points:0,
     type:MOD,
     ship:"X-Wing",
     done:true,
     init: function(sh) {
	 var self=this;
	 var newdeal=function(c,f,p) {
	     var k=-1;
	     for (var i in this.upgrades) {
		 var u=this.upgrades[i];
		 if (u.type==ASTROMECH&&u.isactive==true) { k=i; break; }
	     }
	     if (k==-1||!self.isactive) return p;
	     var pp=$.Deferred();
	     p.then(function(cf) {
		 if (this.shield+this.hull==1||(cf.face==FACEUP&&cf.crit.lethal&&this.shield+this.hull<=2)) {
		     this.upgrades[k].desactivate();
		     this.log("%0 is inactive, damage discarded [%1]",this.upgrades[k].name,self.name);
		     self.desactivate();
		     pp.resolve({crit:cf.crit,face:DISCARD});
		 } else pp.resolve(cf);
	     }.bind(this));
	     return pp.promise();
	 };
	 sh.wrap_after("deal",this,newdeal);
     },
    },
    {name:"Weapons Guidance",
     points:2,
     type:TECH,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req:function(m,n) { 
		 return self.isactive&&this.canusefocus(); 
	     }.bind(sh), 
	     aiactivate: function(m,n) { return FCH_blank(m,n)>0; },
	     f:function(m,n) {
		 var b=FCH_blank(m,n);
		 this.removefocustoken();
		 displayattacktokens(this);
		 if (b>0) {		
		     this.log("1 blank -> 1 %HIT% [%0]",self.name);
		     m=m+FCH_HIT; 
		 } 
		 return m;
	     }.bind(sh),str:"blank"});
     }
    },
    {
        name: "R5-K6",
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("removetarget",this,function(t) {
		this.defenseroll(1).done(function(roll) {
		    if (FE_evade(roll.roll)>0) {
			this.addtarget(t);
			this.log("+1 %TARGET% / %1 [%0]",self.name,t.name);
		    }
		}.bind(this));
	    });
	},
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 2,
    },
    {
        name: "R5 Astromech",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endphase",this,function() {
		var c=-1,cl=-1;
		for (var i=0; i<this.criticals.length; i++) {
		    var cr=this.criticals[i];
		    if (cr.isactive&&cr.type=="ship") {
			c=i;
			if (cr.lethal) { cl=i; break; }
		    }
		}
		if (cl>-1) {
		    this.log("repairing critical %1 [%0]",self.name,this.criticals[cl].name);
		    this.criticals[cl].facedown();
		} else if (c>-1) {
		    this.log("repairing critical %1 [%0]",self.name,this.criticals[c].name);
		    this.criticals[c].facedown();
		}
	    });
	},
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "Determination",
	done:true,
	rating:1,
        init: function(sh) {
	    var self=this;
	    var newdeal=function(c,f,p) {
		if (c.type!="pilot") return p;
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.face==FACEUP) {
			this.log("discarding critical %1 [%0]",self.name,cf.crit.name);
			pp.resolve({crit:cf.crit,face:DISCARD});
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    sh.wrap_after("deal",this,newdeal);
	},
        type: ELITE,
        points: 1,
    },
    {
        name: "Swarm Tactics",
        type: ELITE,
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    if (typeof Unit.prototype.getswarm=="undefined")
		Unit.prototype.getswarm=function() { return [[],[],[]]; }
	    Unit.prototype.wrap_after("getswarm",this,function(p) {
		p[self.unit.team]=p[self.unit.team].concat(self.unit);
		return p;
	    });
	    self.unit.propswarm=-1;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=this.getswarm()[this.team];
		var uu=this;
		if (this!=p[0]) return; // Only one handles all Swarm chain
		var m=p.length;
		for (var i=0; i<m; i++) {
		    this.doselection(function(n) {
			p.sort(function(a,b) {
			    if (a.getskill()>b.getskill()) return 1;
			    if (a.getskill()<b.getskill()) return -1;
			    return 0;
			});
			var u=p.pop();
			var q=u.selectnearbyally(1,function(a,b) {
			    return a.getskill()>b.getskill();
			});
			u.select();
			var sk=u.getskill();
			if (q.length==0) uu.endnoaction(n,"SELECT");
			else u.resolveactionselection(q,function(k) {
			    q[k].wrap_after("getskill",self,function(s) {
				return sk;
			    }).unwrapper("endcombatphase");
			    q[k].log("PS set to %1 [%0]",self.name,sk);
			    q[k].showskill();
			    uu.endnoaction(n,"SELECT");
			});
		    });
		}
	    });
	}
    },
    {
        name: "Squad Leader",
        unique: true,
	done:true,
        type: ELITE,
        points: 2,
	candoaction: function() {  
	    var p=this.unit.selectnearbyally(2,function(t,s) { return s.getskill()<t.getskill()&&s.candoaction();});
	    return (this.isactive)&&(p.length>0);
	},
	action: function(n) {
	    var self=this.unit;
	    var p=self.selectnearbyally(2,function(t,s) { return s.getskill()<t.getskill()&&s.candoaction();});
	    if (p.length>0) {
		self.resolveactionselection(p,function(k) {
		    p[k].select();
		    p[k].doaction(p[k].getactionlist(),"+1 free action").done(function() {
			self.select();
		    });
		    self.endaction(n,"ELITE");
		});
	    } else {
		self.log("no lower skilled pilot within range 2 [%0]",this.name);
		self.endaction(n,"ELITE");
	    }
	},
    },
    {
        name: "Expert Handling",
	rating:1,
	candoaction: function() { return this.isactive&&this.unit.actionsdone.indexOf("ROLL")==-1; },
	action: function(n) {
	    if (this.unit.shipactionList.indexOf("ROLL")==-1) this.unit.addstress();
	    if (this.unit.istargeted.length>0) {
		this.unit.log("select target to lock [%0]",this.name);
		this.unit.resolveactionselection(this.unit.istargeted,function(k) {
		    var unit=this.istargeted[k];
		    unit.removetarget(this);
		    this.resolveroll(n);
		}.bind(this.unit));
	    } else this.unit.resolveroll(n);
	},        
        type: ELITE,
	done:true,
        points: 2,
    },
    {
        name: "Marksmanship",
	rating:1,
	init: function(sh) {
	    this.mark=-1;
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (this.mark==round)&&this.isactive;
		}.bind(this),
		aiactivate: function(m,n) { return FCH_focus(m)>0; },
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0&&this.mark==round) {	
			if (f>1) this.unit.log("%0 %FOCUS% -> 1 %CRIT%, %1 %HIT% [%2]",f,f-1,self.name); else this.unit.log("1 %FOCUS% -> 1 %CRIT% [%1]",f,self.name);
			m=m-FCH_FOCUS*f+FCH_CRIT+(f-1)*FCH_HIT; 
		    } 
		    return m;
		}.bind(this),
		str:"focus",
		noreroll:"focus"
	    });
	},
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    this.mark=round;
	    this.unit.endaction(n,ELITE);
	},
        done:true,
        type: ELITE,
        points: 3,
    },
    {
        name: "Concussion Missiles",
	requires:"Target",
	consumes:true,
        type: MISSILE,
	firesnd:"missile",
        points: 4,
        attack: 4,
	done:true,
	init: function(sh) {
	    var missile=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return sh.weapons[sh.activeweapon]==this&&missile.isactive;
		}.bind(this),
		f:function(m,n) {
		    var b=FCH_blank(m,n);
		    if (b>0) m=m+FCH_HIT; 
		    return m;
		}.bind(this),str:"blank"});
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&missile.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });

	},
        range: [2,3],
    },
    {
        name: "Cluster Missiles",
        type: MISSILE,
	firesnd:"missile",
	requires:"Target",
	consumes:true,
        points: 4,
        attack: 3,
	done:true,
	followupattack: function() { return this.unit.weapons.indexOf(this); },
	hasdoubleattack:function() {
	    this.twinattack=!this.twinattack;
	    return this.twinattack;
	},
	init: function(sh) {
	    this.twinattack=false;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},
        range: [1,2],
    },
    {
        name: "Daredevil",
	done:true,
	rating:1,
        candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this;
	    this.unit.log("select maneuver [%0]",this.name);
	    this.unit.resolveactionmove(
		[this.unit.getpathmatrix(this.unit.m,"TL1"),
		 this.unit.getpathmatrix(this.unit.m,"TR1")],
		function(t,k) { 
		    if (k==-1) return t.endaction(n,ELITE);
		    t.addstress(); 
		    if (t.shipactionList.indexOf("BOOST")==-1) {
			t.log("2 rolls for damage [%0]",self.name);
			var roll=t.rollattackdie(2,self,"hit");
			for (var i=0; i<2; i++) {
			    if (roll[i]=="hit") t.resolvehit(1); 
			    else if (roll[i]=="critical") t.resolvecritical(1);
			}
			t.checkdead();
		    }
		    t.endaction(n,ELITE);
		},true,true);
	},
        type: ELITE,
        points: 3,
    },
    {/* TODO: cannot reroll twice a dice ? */
        name: "Elusiveness",
	done:true,
	rating:1,
        init:function(sh) {
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,MOD_M,ATTACK_M,this,{
		req:function() {
		    return this.stress==0&&targetunit==this&&self.isactive;
		}.bind(sh),
		aiactivate: function(m,n) {
		    sh.log("activate elusiveness "+FCH_crit(m)+" "+FCH_hit(m));
		    return FCH_crit(m)+FCH_hit(m)>0;
		},
		f:function(m,n) {
		    this.unit.addstress();
		    if (FCH_crit(m)>0) {
			this.unit.log("1 %CRIT% rerolled [%0]",this.name);
			m=m-FCH_CRIT+activeunit.attackroll(1);
		    } else if (FCH_hit(m)>0) {
			this.unit.log("1 %HIT% rerolled [%0]",this.name);
			m=m-FCH_HIT+activeunit.attackroll(1);
		    }
		    return m;
		}.bind(this),str:"critical"});
	},
        type: ELITE,
        points:2,
    },
    {
        name: "Homing Missiles",
	requires:"Target",
	consumes:false,
        type: MISSILE,
	firesnd:"missile",
        attack: 4,
        range: [2,3],
	done:true,
	declareattack: function(target) {
	    targetunit.wrap_after("canuseevade",this,function() { return false; }).unwrapper("afterdefenseeffect");
	    targetunit.log("cannot use evade tokens [%0]",this.name);
	    return Weapon.prototype.declareattack.call(this,target);
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });

	},
        points: 5
    },
    {
        name: "Push the Limit",
	init: function(sh) {
	    var ptl=this;
	    ptl.r=-1;
	    sh.wrap_before("endaction",this,function(n,type) {
		if (ptl.r!=round&&this.candoaction()&&type!=null) {
		    ptl.r=round;
		    this.doaction(this.getactionbarlist(),"+1 free action (Skip to cancel) ["+ptl.name+"]").done(function(type2) {
			if (type2==null) ptl.r=-1; 
			else this.addafteractions(function() { this.addstress(); }.bind(this));
		    }.bind(this));
		}
	    });
	},
	done:true,
        type: ELITE,
        points: 3
    },
    {
        name: "Deadeye",
	islarge:false,
	rating:2,
        init: function(sh) {
	    for (var i in sh.weapons) 
		sh.weapons[i].wrap_after("getrequirements",this,function(g) {
		    if (g=="Target") return "Target|Focus";
		    return g;
		});
	},
	done:true,
        type: ELITE,
        points: 1
    },
    {
        name: "Expose",
	rating:0,
        candoaction: function() { return this.isactive; },
	action: function(n) {
	    var w=this.unit.weapons[0];
	    var self=this;
	    this.unit.log("-1 agility, +1 primary attack until end of turn [%0]",this.name);
	    this.unit.wrap_after("getagility",this,function(a) {
		if (a>0) return a-1; else return 0;
	    }).unwrapper("endphase");
	    w.wrap_after("getattack",this,function(a) {
		return a+1;
	    }).unwrapper("endround");
	    this.unit.showstats();
	    this.unit.endaction(n,ELITE);
	},
	done:true,
        type: ELITE,
        points: 4,
    },
    {
        name: "Gunner",
	done:true,
        init: function(sh) {
	    for (var i in sh.weapons) 
		sh.weapons[i].immediateattack={pred:function(k) { return k==0; },weapon:function() { return 0;}};
	    sh.addattack(function(c,h) { 
		return this.weapons[0].isactive&&c+h==0; 
	    },this,[sh.weapons[0]],function() {	
		this.noattack=round; 
	    },function() { 
		return this.selectnearbyenemy(3);
	    });
	},
        type: CREW,
        points: 5,
    },
    {
        name: "Ion Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifyhit: function(ch) { return FCH_HIT; },
	prehit: function(target,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    target.log("+%1 %HIT%, +1 ion token [%0]",this.name,1);
	    target.addiontoken();
	},
        points: 3,
        attack: 3,
        range: [1,3],
    },
    {
        name: "Heavy Laser Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifydamagegiven: function(ch) {
	    if (FCH_crit(ch)>0) {
		var c=FCH_crit(ch);
		this.unit.log("%0 %CRIT%-> %0 %HIT% [%1]",c,this.name);
		ch=ch-FCH_CRIT*c+c*FCH_HIT;
	    }
	    return ch;
	},
        points: 7,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Seismic Charges",
	done:true,
	img:"seismic.png",
	snd:"explode",
	width: 16,
	height:8,
	size:15,
        explode:function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    var u=squadron[r[1][i].unit];
		    u.log("+1 %HIT% [%0]",this.name);
		    u.resolvehit(1);
		    u.checkdead();
		}
		this.explode_base();
	    }
	},
        type: BOMB,
        points: 2,
    },    

    {
        name: "Mercenary Copilot",
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { return (this.getrange(targetunit)==3); }.bind(sh),
		aiactivate: function(m,n) { return FCH_hit(m)>0; },
		f:function(m,n) {
		    if (FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
			m=m-FCH_HIT+FCH_CRIT; 
		    } 
		    return m;
		}.bind(sh),str:"hit"});
	},
	done:true,
        type: CREW,
        points: 2,
    },
    {
        name: "Assault Missiles",
        type: MISSILE,
	requires:"Target",
	consumes:true,
	firesnd:"missile",
	done:true,
	prehit: function(t,c,h) {
	    var r=t.getrangeallunits();
	    for (var i=0; i<r[1].length; i++) {
		var u=squadron[r[1][i].unit];
		if (u!=t) {
		    squadron[r[1][i].unit].log("+1 %HIT% [%0]",this.name);
		    squadron[r[1][i].unit].resolvehit(1);
		}
	    }
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });

	},
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Veteran Instincts",
	done:true,
        install: function(sh) {
	    sh.installed=true;
	    sh.wrap_after("getskill",this,function(s) {
		return s+2;
	    });
	    sh.showskill();
	},
	uninstall: function(sh) {
	    if (typeof sh.getskill.unwrap=="function") sh.getskill.unwrap(this);
	    sh.showskill();

	},
        type: ELITE,
        points: 1,
    },
    {
        name: "Proximity Mines",
	img: "proximity.png",
	snd:"explode",
	width: 18,
	height:18,
	size:35,
	done:true,
	stay: true,
	candoaction: function() { return this.unit.lastdrop!=round&&this.isactive; },
	action: function(n) { this.actiondrop(n); },
	canbedropped:function() { return false; },
        explode: function() {},
	detonate:function(t) {
	    if (!this.exploded) {
		var roll=this.unit.rollattackdie(3,this,"critical");
		for (var i=0; i<3; i++) {
		    if (roll[i]=="hit") { 
			t.log("+1 %HIT% [%0]",this.name); 
			t.resolvehit(1); t.checkdead(); }
		    else if (roll[i]=="critical") { 
			t.log("+1 %CRIT% [%0]",this.name); 
			t.resolvecritical(1);
			t.checkdead();
		    }
		}
		Bomb.prototype.detonate.call(this);
	    }
	},
        getOutlineString: function(m) {
	    var N=25;
	    var s="M ";
	    this.op=[];
	    if (typeof m=="undefined") m=this.m;
	    for (var i=0; i<N; i++){ 
		var p=transformPoint(m,{
		    x:this.size*Math.sin(2*i*Math.PI/N),
		    y:this.size*Math.cos(2*i*Math.PI/N)});
		this.op.push(p);
		s+=p.x+" "+p.y+" ";
		if (i==0) s+="L ";
	    }
	    s+="Z";
	    return {s:s,p:this.op};
	},
        type: BOMB,
        points: 3,
    },
    {
        name: "Weapons Engineer",
        type: CREW,
        points: 3,
	done:true,
	init: function(sh) {
	    this.second=false;
	    var self=this;
	    sh.boundtargets=function(t) {
		if (this.targeting.indexOf(t)>-1) return true;
		for (var i=this.targeting.length-2; i>=0; i--) 
		    this.removetarget(this.targeting[i]);
		return false;
	    };
	    sh.wrap_after("addtarget",this,function(u) {
		if (this.second==true) this.second=false;
		else this.doselection(function(n) {
		    this.second=true;
		    this.log("select target to lock [%0]",self.name);
		    this.resolvetargetnoaction(n,true);
		}.bind(this));
	    });
	}
    },
    { /* TODO: a ship is still hit if crit is transferred ? */
        name: "Draw Their Fire",
	rating:1,
        init: function(sh) {
	    var self=this;
	    self.ea=Unit.prototype.resolvecritical;
	    Unit.prototype.resolvecritical=function(c) {
		if (!self.unit.dead&&self.isactive
		    &&c>0&&(self.unit in this.selectnearbyally(1))){
		    this.selectunit([this,sh],function(p,k) {
			if (k==0) { self.ea.call(this,1); }
			else { self.ea.call(sh,1);}
		    },["select unit [%0]",self.name],false);
		    self.ea.call(this,c-1);
		} else self.ea.call(this,c);
		return c;
	    }
	}, 
	done:true,
        type: ELITE,
        points: 1,
    },
    {
        name: "Luke Skywalker",
        faction:REBEL,
        unique: true,
	done:true,
        init: function(sh) {
	    var self=this;
	    for (var i in sh.weapons) 
		sh.weapons[i].immediateattack={pred:function(i) { return i==0; },weapon:function() { return 0;}};
	    sh.addattack(function(c,h) { 
		return this.weapons[0].isactive&&c+h==0; 
	    },this,[sh.weapons[0]],function() {	
		this.noattack=round; 
	    },function() { 
		return this.selectnearbyenemy(3);
	    });
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { return self.unit.addedattack==round&&self.isactive;},
		aiactivate: function(m,n) {
		    return FCH_focus(m)>0;
		},
		f:function(m,n) {
		    if (FCH_focus(m)>0) {
			this.log("1 %FOCUS% -> 1 %HIT% [%0]",self.name);
			m=m-FCH_FOCUS+FCH_HIT;
		    } 
		    return m;
		},str:"focus"});
	},
        type: CREW,
        points: 7,
    },
    {
        name: "Nien Nunb",
	faction:REBEL,
	done:true,
        install: function(sh) {
	    var save=[];
	    sh.installed=true;
	    sh.wrap_after("getdial",this,function(gd) {
		for (var i=0; i<gd.length; i++)
		    if (gd[i].move.match(/F[1-5]/)) gd[i].difficulty="GREEN";
		return gd;
	    });
	    sh.wrap_after("getmaneuver",this,function(m) {
		if (m.move.match(/F[1-5]/)) return {move:m.move,difficulty:"GREEN"};
		return m;
	    });

	},
	uninstall:function(sh) {
	    if (typeof sh.getdial.unwrap=="function") 
		sh.getdial.unwrap(this);
	},
        unique: true,
        type: CREW,
        points: 1,
    },
    {
        name: "Chewbacca",
        faction:REBEL,
        unique: true,
	done:true,
        type: CREW,
	init: function(sh) {
	    var self=this;
	    var newdeal=function(c,f,p) {
		if (!self.isactive) return p;
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (this.hull+this.shield==1||(cf.face==FACEUP&&cf.crit.lethal&&this.hull+this.shield<=2)) {
			if (this.shield<this.ship.shield) this.addshield(1);
			this.log("+1 %SHIELD%, 1 damage discarded [%0]",self.name);
			self.desactivate();
			pp.resolve({crit:cf.crit,face:DISCARD});
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    sh.wrap_after("deal",this,newdeal);
	},
        points: 4,
    },
    {
        name: "Advanced Proton Torpedoes",
	requires:"Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
        attack: 5,
	done:true,
        range: [1,1],
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (sh.weapons[sh.activeweapon]==this);
		}.bind(this),
		aiactivate: function(m,n) { return FCH_blank(m,n)>0; },
		f:function(m,n) {
		    var b=FCH_blank(m,n);
		    if (b>3) b=3;
		    if (b>0) {
			this.unit.log("%0 blanks -> %0 %FOCUS% [%1]",b,this.name);
			m+=b*FCH_FOCUS;
		    }
		    return m;
		}.bind(this),str:"blank"});
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });

	},        
        points: 6,
    },
    {
        name: "Autoblaster",
        type: CANNON,
	done:true,
	firesnd:"slave_fire",
        attack: 3,
	declareattack: function(target) {
	    var self=this;
	    target.wrap_after("cancelhit",self,function(r,org,r2) {
		self.unit.log("%HIT% cannot be cancelled [%0]",self.name);
		return r;
	    }).unwrapper("afterdefenseeffect");
	    return Weapon.prototype.declareattack.call(this,target);
	},
        range: [1,1],
        points: 5,
    },
    {
        name: "Fire-Control System",
	done:true,
        init: function(sh) {
	    var self=this;
	    self.f=-1;
	    sh.wrap_before("postattack",this,function(i) {this.reroll=10; });
	    sh.addafterattackeffect(this,function() {
		if (this.gettargetableunits(3).indexOf(targetunit)>-1) {
		    this.log("+1 %TARGET% / %1 [%0]",self.name,targetunit.name);
		    this.addtarget(targetunit);
		} else this.log("no valid target [%0]",self.name);
	    });
	},
        type: SYSTEM,
        points: 2,
    },
    {
        name: "Blaster Turret",
        type: TURRET,
	done:true,
	firesnd:"falcon_fire",
	requires:"Focus",
	consumes:true,
        points: 4,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Recon Specialist",
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("addfocus",this,function(n) {
		sh.log("+1 %FOCUS% [%0]",self.name);
		sh.addfocustoken();
	    });
	},
	done:true,
        type: CREW,
        points: 3,
    },
    {
        name: "Saboteur",
        type: CREW,
	done:true,
	candoaction:function() { 
	    var a=this.unit.selectnearbyenemy(1);
	    return this.isactive&&a.length>0;
	}, 
	action: function(n) {
	    var self=this;
	    if (!this.isactive) { this.unit.endaction(n,"CREW"); return; }
	    var p=this.unit.selectnearbyenemy(1);
	    if (p.length>0) {		
		this.unit.log("select unit [%0]",this.name);
		this.unit.resolveactionselection(p,function(k) {
		    var i,q=[];
		    for (i=0; i<p[k].criticals.length; i++) 
			if (p[k].criticals[i].isactive==false) q.push(i);
		    if (q.length>0) {
			var r=p[k].rand(q.length);
			p[k].log("turn faceup one damage card [%0]",self.name);
			p[k].criticals[q[r]].faceup();
			p[k].show();
		    } else p[k].log("no damage card [%0]",self.name);
		    this.endaction(n,"CREW");
		}.bind(this.unit));
	    } else this.unit.endaction(n,"CREW");
	},
        points: 2,
    },
    {
        name: "Intelligence Agent",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivationphase",this,function() {
		this.selectunit(this.selectnearbyenemy(2),function(p,k) {
		    p[k].showmaneuver();
		    var d = p[k].getmaneuver();
		    p[k].log("has a %0<span class='symbols'>"+P[d.move].key+"</span> maneuver [%1]",P[d.move].speed,self.name);

		},["select unit [%0]",self.name],false);
	    });
	},
        type: CREW,
        points: 1,
    },
    {
        name: "Proton Bombs",
        done:true,
	width: 32,
	height:30,
	size:15,
	snd:"explode",
	img:"proton.png",
	explode:function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].applycritical(1);
		    squadron[r[1][i].unit].checkdead();
		}
		this.explode_base();
	    }
	},
        type: BOMB,
        points: 5,
    },
    {
        name: "Adrenaline Rush",
	done:true,
	rating:1,
        init: function(sh) {
	    var upg=this;
	    sh.wrap_after("updateactivationdial",this,function() {
		this.addactivationdial(function() { 
		    // if ionized, doesnot reveal a maneuver
		    return !this.hasionizationeffect()
			&&!this.hasmoved
			&&upg.isactive
			&&this.maneuver>-1
			&&(this.getmaneuver().difficulty=="RED"); 
		}.bind(this),function() {
		    this.log("red into white maneuver [%0]",upg.name);
		    upg.desactivate();
		    this.wrap_after("getmaneuver",upg,function(d) {
			return {move:d.move,difficulty:"WHITE"};
		    }).unwrapper("endactivationphase"); 
		    this.show();
		}.bind(this), A[ELITE.toUpperCase()].key, $("<div>").attr({class:"symbols"}));
		return this.activationdial;
	    })
	},        
        type: ELITE,
        points: 1,
    },
    {
        name: "Advanced Sensors",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivation",this,function() {
		if (this.candoaction()&&!this.hasionizationeffect()) 
		    this.doaction(this.getactionlist(),"").done(function(r) {
			if (r!=null) this.wrap_after("candoendmaneuveraction",self,function() { return false;}).unwrapper("endactivationphase");
		    }.bind(this))
	    });
	},
        type: SYSTEM,
        points: 3,
    },
    {
        name: "Sensor Jammer",
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return self.isactive;
		}.bind(sh),
		aiactivate: function(m,n) { return FCH_hit(m)>0; },
		f:function(m,n) {
		    var h=FCH_hit(m);
		    if (h>0) {
			this.unit.log("1 %HIT% -> 1 %FOCUS% [%0]",self.name);
			m=m-FCH_HIT+FCH_FOCUS;
		    }
		    return m;
		}.bind(this),str:"hit"});
	},
	done:true,
        type: SYSTEM,
        points: 4,
    },
    {
        name: "Darth Vader",
        faction:EMPIRE,
        unique: true,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.addafterattackeffect(self,function() {
		if (this.hasfired) 
		    this.donoaction([{org:self,type:"CREW",name:self.name,action:function(n) {
			self.unit.log("+%1 %HIT% [%0]",self.name,2);
			targetunit.log("+1 %CRIT% [%0]",self.name); 
			this.resolvehit(2);
			SOUNDS.explode.play();
			targetunit.resolvecritical(1);
			this.checkdead();
			targetunit.checkdead();
			this.endnoaction(n,"CREW");
		    }.bind(this)}],"",true);
	    });
	},
        type: CREW,
        points: 3,
    },
    {
        name: "Rebel Captive",
	faction:EMPIRE,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.rebelcaptive=0;
	    sh.wrap_before("isattackedby",this,function(w,t) {
		if (this.rebelcaptive!=round) {//First attack this turn
		    t.log("+1 %STRESS% [%0]",self.name);
		    t.addstress();
		    this.rebelcaptive=round;
		}
	    }.bind(this));
	},
        unique: true,
        type: CREW,
        points: 3,
    },
    {
        name: "Flight Instructor",
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["focus"],
		n:function() { if (activeunit.getskill()<=2) return 2; return 1; },
		req:function(attacker,w,defender) {
		    if (this.isactive) 
			this.unit.log("+%1 %FOCUS% reroll(s) [%0]",self.name,(activeunit.getskill()<=2?2:1));
		    return this.isactive;
		}.bind(this)
	    });
	},
	done:true,
        type: CREW,
        points: 4,
    },
    {
        name: "Navigator",
        init: function(sh) {
            sh.wrap_after("getmaneuverlist",this,function(list) {
		var gd=this.getdial();
		var p=list;
		if (this.hasionizationeffect()) return p;
		for (var i in list) {
		    var bearing=i.replace(/\d/,'');
		    for (j=0; j<gd.length; j++) 
			if (gd[j].move.match(bearing)
			    &&typeof p[gd[j].move]=="undefined"
			    &&(gd[j].difficulty!="RED"||this.stress==0)) p[gd[j].move]=gd[j];
		}
		return p;
	    });
	},
	done:true,
        type: CREW,
        points: 3,
    },
    {
        name: "Opportunist",
	rating:2,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("preattackroll",this,function(w,t) {
		if (t.focus+t.evade==0&&this.stress==0) 
		    this.donoaction([{org:this,name:this.name,type:"ELITE",action:function(n) {
			this.wrap_after("getattackstrength",self,function(i,t,a) {
			    return a+1;
			}).unwrapper("endattack");
			this.addstress();
			this.log("+1 attack against %1, +1 %STRESS% [%0]",self.name,t.name);
			this.endnoaction(n,"ELITE");
		    }.bind(this)}],"",true);
	    });
	},
        type: ELITE,
        points: 4,
    },
    {
        name: "Ion Pulse Missiles",
	requires:"Target",
	consumes:false,
        type: MISSILE,
	firesnd:"missile",
	done:true,
	modifyhit: function(ch) { return FCH_HIT; },
	prehit: function(t,c,h) {
	    this.unit.log("+%1 %HIT%, +1 ion token [%0]",this.name,2);
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    t.addiontoken(); t.addiontoken();
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},
        points: 3,
        attack: 3,
        range: [2,3],
    },
    {
        name: "Wingman",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyally(1,function(s,t) { 
		    return t.stress>0; }),
				function(p,k) {
				    p[k].removestresstoken();
				},["select unit [%0]",self.name],false);
	    });
	},
        type: ELITE,
        points: 2,
    },
    {
        name: "Decoy",
	rating:1,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		this.selectunit(this.selectnearbyally(2),function(p,k) {
		    var s1=p[k].getskill();
		    var s2=this.getskill();
		    this.wrap_after("getskill",self,function(s) {
			return s1;
		    }).unwrapper("endcombatphase");
		    p[k].wrap_after("getskill",self,function(s) {
			return s2;
		    }).unwrapper("endcombatphase");
		}, ["select unit (or self to cancel) [%0]",self.name],true);
	    });
	},
	done:true,
        type: ELITE,
        points: 2,
    },
    {
        name: "Outmaneuver",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("resolveattack",this,function(w,targetunit) {
		targetunit.wrap_after("getdefensestrength",self,function(i,t,d) {
		    if(!this.isinfiringarc(t)&&t.isinfiringarc(this)&&d>0) {
			this.log("-1 defense [%0]",self.name);
			return d-1;
		    }
		    return d;
		}).unwrapper("dodefenseroll");
	    });
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Predator",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { if (targetunit.getskill()<=2) return 2; return 1; },
		req:function(a,w,defender) {
		    this.log("+%1 reroll(s) [%0]",self.name,(targetunit.getskill()<=2?2:1));
		    return self.isactive;
		}.bind(sh)});
	},
        type: ELITE,
        points: 3,
    },
    {
        name: "Flechette Torpedoes",
	requires:"Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	endattack: function(c,h) {
	    if (targetunit.hull<=4) targetunit.addstress();
	    Weapon.prototype.endattack.call(this);
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},
        points: 2,
        attack: 3,
        range: [2,3],
    },
    { /* TODO: Does not spend the target roll */
        name: "R7 Astromech",
        type: ASTROMECH,
        points: 2,
	done:true,
	init: function(sh) {
	    sh.adddicemodifier(DEFENSE_M,REROLL_M,ATTACK_M,this,{
		dice:["critical","hit","focus"],
		n:function() { return 9; },
		req: function() { return this.targeting.indexOf(activeunit)>-1; }.bind(sh),
		mustreroll:true,
	    });
	}
    },
    {
        name: "R7-T1",
	candoaction: function() { return this.isactive; },	    
	action: function(n) {
	    var self=this;
	    var p=this.unit.selectnearbyenemy(2);
	    if (p.length>0&&this.isactive) {
		this.unit.log("select unit [%0]",self.name);
		this.unit.resolveactionselection(p,function(k) {
		    if (p[k]!=this) { 
			if (p[k].isinfiringarc(this)) this.addtarget(p[k]);
			this.resolveboost(n);
		    } else this.endaction(n,"ASTROMECH");
		}.bind(this.unit));
	    } else this.unit.endaction(n,"ASTROMECH");
	},
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    {
        name: "Tactician",
        type: CREW,
	limited:true,
        points: 2,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.addafterattackeffect(this,function(c,h) {
		if (this.getsector(targetunit)==2) {
		    targetunit.addstress();
		    targetunit.log("+1 %STRESS% [%0]",self.name);
		}
	    });
	},
    },
    {
        name: "R2-D2",
        faction:REBEL,
        unique: true,
        type: CREW,
        points: 4,
	done:true,
	init: function(sh) {
	    var x=this;
	    sh.wrap_after("endphase",this,function() {
		var p=[];
		var c=this.criticals;
		for (var i=0; i<c.length; i++) 
		    if (!c[i].isactive) p.push(c[i]);
		if (this.shield==0&&this.ship.shield>0) {
		    this.log("+1 %SHIELD% [%0]",x.name);
		    this.addshield(1);
		    this.show();
		    if (p.length>0) {
			var crit=p[this.rand(p.length)]
			if (FCH_hit(this.attackroll(1))>0) {
			    this.log("+1 %CRIT% [%0]",this.name);
			    crit.faceup();
			}
		    } 
		}
	    });
	},
    },
    {
        name: "C-3PO",
        unique: true,
        faction:REBEL,
        type: CREW,
        points: 3,
	done:true,
	init:function(sh) {
	    var self=this;
	    var c3po=-1;
	    sh.wrap_after("defenseroll",this,function(r,promise) {
		if (c3po==round) return promise;
		var lock=$.Deferred();
		c3po=round;
		promise.done(function(roll) {
		    this.guessevades(roll,lock);
		}.bind(this));
		return lock.promise();
	    });
	},
    },
    {
        name: "R3-A2",
	done:true,
        init: function(sh) {
	    var self=this;/* TODO : to test, changed timing */
	    sh.wrap_after("declareattack",this,function(w,target,b) {
		if (this.isinfiringarc(target)&&b) {
		    this.donoaction([{org:self,name:self.name,type:"ASTROMECH",action:function(n) {
			this.addstress();
			this.log("+1 %STRESS% [%0]",self.name);
			target.log("+1 %STRESS% [%0]",self.name);
			target.addstress();
			this.endnoaction(n,"ASTROMECH");
		    }.bind(this)}],"",true);
		}
	    })
	},
        unique: true,
        type: ASTROMECH,
        points: 2,
    },
    {
        name: "R2-D6",
        upgrades:[ELITE],
	noupgrades:ELITE,
	skillmin:3,
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "Enhanced Scopes",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("beginactivationphase",this,function() {
		this.log("PS set to %1 [%0]",self.name,0); 
		this.wrap_after("getskill",self,function(s) {
		    return 0;
		}).unwrapper("endactivationphase");
	    });
	},
        type: SYSTEM,
        points: 1,
    },
    {
        name: "Chardaan Refit",
        type: MISSILE,
	done:true,
	firesnd:"missile",
	isWeapon: function() { return false; },
        points: -2,
        ship: "A-Wing"
    },
    {
        name: "Proton Rockets",
        type: MISSILE,
	firesnd:"missile",
	requires:"Focus",
	consumes:false,
        points: 3,
        attack: 2,
	done:true,
	getattack: function() {
	    a=this.attack;
	    if (this.unit.agility<=3) a+=this.unit.agility;
	    else a+=3;
	    return a;
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="FOCUS"&&self.isactive&&this.candofocus()) 
		    a.priority+=10;
	    });

	},
        range: [1,1],
    },
    {
        name: "Kyle Katarn",
        faction:REBEL,
        unique: true,
	done:true,
        type: CREW,
        points: 3,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("removestresstoken",this,function() {
		this.log("-1 stress -> +1 %FOCUS% [%0]",self.name);
		this.addfocustoken();
	    });
	},
        
    },
    {
        name: "Jan Ors",
        faction:REBEL,
        unique: true,
        type: CREW,
        points: 2,
	done:true,
	init: function(sh) {
	    this.jan=-1;
	    var self=this;
	    Unit.prototype.wrap_after("addfocustoken",this,function() {
		if (!self.unit.dead&&this.getrange(sh)<=3&&this.isally(sh)&&self.jan<round) {
		    this.log("select %FOCUS% or %EVADE% token [%0]",self.name)
		    this.donoaction(
			[{name:self.name,org:self,type:"FOCUS",action:function(n) { 
			    this.endnoaction(n,"FOCUS"); }.bind(this)},
			 {name:self.name,org:self,type:"EVADE",action:function(n) { 
			     self.jan=round;
			     this.focus--; /* fix for bug with Garven */
			     this.addevadetoken(); 
			     this.endnoaction(n,"EVADE"); }.bind(this)}],
			"",false);
		}
	    })
	},
    },

    {
        name: "R4-D6",
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("cancelhit",this,function(r,org,r2) {
		var h=FCH_hit(r2.ch);
		if (h>=3) {
		    sh.log("cancelling %0 hits [%1]",h-2,self)
		    var d=h-2;
		    var ch=r2.ch-d*FCH_HIT;
		    for (var i=0; i<d; i++) sh.addstress();
		    return {ch:ch,e:r2.e};
		}
		return r2;
	    })
	},
	done:true,
        unique: true,
        type: ASTROMECH,
        points: 1,
    },
    {
        name: "R5-P9",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endcombatphase",this,function() {
		if (this.canusefocus()&&this.shield<this.ship.shield) {
		    this.addshield(1);
		    this.log("1 %FOCUS% -> 1 %SHIELD% [%0]",self.name);
		    this.removefocustoken();
		}
	    });
	},        
        unique: true,
        type: ASTROMECH,
        points: 3,
    },
    {
        name: "Han Solo",
        faction:REBEL,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return self.isactive&&this.targeting.indexOf(targetunit)>-1;
		}.bind(sh), 
		aiactivate: function(m,n) {
		    return FCH_focus(m)>0;
		},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    this.log("%0 %FOCUS% -> %0 %HIT% [%1]",f,self.name);
		    this.removetarget(targetunit);
		    return m-FCH_FOCUS*f+FCH_HIT*f;
		}.bind(sh),str:"target",noreroll:"focus"});
	},
        type: CREW,
        unique: true,
        done:true,
        points: 2,
    },
    { 
        name: "Leia Organa",
        faction:REBEL,
        type: CREW,
        unique: true,
	done:true,
	init: function(sh) {
	    var mod=this;
	    var self=sh;
	    sh.wrap_before("beginactivationphase",this,function() {
		if (mod.isactive) 
		this.donoaction([{type:"CREW",org:mod,name:mod.name,action:function(n) {
		    mod.desactivate();
		    for (var i in squadron) {
			if (squadron[i].isally(self)) 
			    squadron[i].wrap_after("getmaneuver",mod,function(m) {
				if (m.difficulty=="RED") 
				    m.difficulty="WHITE";
				return m;
			    }).unwrapper("endactivationphase");
		    }
		    this.endnoaction(n,"CREW");
		}.bind(this)}],"",true);
	    })
	},

        points: 4,
    },
    {
        name: "Targeting Coordinator",
        type: CREW,
        limited: true,
	done:true,
        points: 4,
	/*TODO: done ?? */
    },

    {
        name: "Lando Calrissian",
        faction:REBEL,
        type: CREW,
        unique: true,
	done:true,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this;
	    var str="";
	    if (this.isactive) 
		this.unit.defenseroll(2).done(function(roll) {
		    var f=FE_focus(roll.roll);
		    var e=FE_evade(roll.roll);
		    for (var i=0; i<f; i++) this.addfocustoken(); 
		    if (f>0) str+=" +"+f+" %FOCUS%"; 
		    for (var i=0; i<e; i++) this.addevadetoken(); 
		    if (e>0) str+=" +"+e+" %EVADE%"; 
		    if (str=="") this.log("no effect [%0]",self.name); else this.log(str+" [%0]",self.name);
		    this.endaction(n,"CREW");
		}.bind(this.unit));
	    else this.unit.endaction(n,"CREW");
	},
        points: 3,
    },
    {
        name: "Mara Jade",
        faction:EMPIRE,
        type: CREW,
        unique: true,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("endcombatphase",this,function() {
		var p=this.gettargetableunits(1);
		for (var i=0; i<p.length; i++) 
		    if (p[i].stress==0) {
			p[i].log("+1 %STRESS% [%0]",self.name);
			p[i].addstress();
		    }
	    });
	},
        points: 3,
    },
    {
        name: "Fleet Officer",
        faction:EMPIRE,
        type: CREW,
	done:true,
        candoaction: function() { return this.isactive;	},
	action: function(n) {
	    var self=this;
	    if (!this.isactive) { this.unit.endaction(n,CREW); return;}
	    var p=this.unit.selectnearbyally(2);
	    if (p.length>0) {
		if (p.length==1) {
		    p[0].addfocustoken();
		    this.unit.addstress();
		    this.unit.endaction(n,CREW);
		}else if (p.length==2) {
		    p[0].addfocustoken(); p[1].addfocustoken();
		    p[0].log("adding focus");
		    p[1].log("adding focus");
		    this.unit.addstress();
		    this.unit.endaction(n,CREW);
		} else {
		    this.unit.log("select 2 units [%0]",self.name);
		    this.unit.resolveactionselection(p,function(k) {
			p[k].addfocustoken();
			p.splice(k,1);
			if (p.length>0) 
			    this.resolveactionselection(p,function(l) {
				p[l].addfocustoken();
				this.addstress();
				this.endaction(n,CREW);
			    }.bind(this));
			else this.endaction(n,CREW);
		    }.bind(this.unit))
		}
	    } else this.unit.endaction(n,CREW);
	},
        points: 3,
    },
    {
        name: "Stay On Target",
        type: ELITE,
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
            sh.wrap_after("getmaneuverlist",this,function(list) {
		var gd=this.getdial();
		var p=list;
		if (this.hasionizationeffect()||this.stress>0) return p;
		for (var i in list) {
		    var speed=list[i].move.substr(-1);
		    for (var j=0; j<gd.length; j++) 
			if (gd[j].move.substr(-1)==speed
			    &&typeof p[gd[j].move]=="undefined") { 
			    p[gd[j].move]={move:gd[j].move,difficulty:"RED",halfturn:false};
			}
		}
		return p;
	    });
	},
    },
    {
        name: "Dash Rendar",
        faction:REBEL,
        unique: true,
	done:true,
	init: function(sh) {
	    sh.wrap_after("isfireobstructed",this,function() { return false; });
	    sh.wrap_after("getobstructiondef",this,function() { return 0; });
	},
        type: CREW,
        points: 2,
        
    },
    {
        name: "Lone Wolf",
	done:true,
	rating:3,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank"],
		n:function() { return 1;},
		req:function(a,w,defender) {
		    var p=this.unit.selectnearbyally(2,function(s,t) { return s!=t; });
		    if (p.length==0&&self.isactive) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0&&self.isactive; 
		}.bind(this)});
	    sh.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
		dice:["blank"],
		n:function() { return 1;},
		req:function(attacker,w,defender) {
		    var p=this.unit.selectnearbyally(2,function(s,t) { return s!=t; });
		    if (p.length==0&&self.isactive) {
			this.unit.log("+1 blank reroll [%0]",self.name);
		    }
		    return p.length==0&&self.isactive; 
		}.bind(this)});
	},
        unique: true,
        type: ELITE,
        points: 2,
    },
    {
        name: "'Leebo'",
        faction:REBEL,
        unique: true,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    if (!this.isactive) { this.unit.endaction(n,"BOOST"); return; }
	    this.unit.log("free %BOOST% and ion token [%0]",this.name);
	    this.unit.addiontoken();
	    this.unit.resolveboost(n);
	},
	done:true,
        type: CREW,
        points: 2,
        
    },
    {
        name: "Ruthlessness",
        faction:EMPIRE,
        type: ELITE,
        points: 3,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.addafterattackeffect(this,function(c,h) {
		if (c+h==0) return;
		var p=targetunit.selectnearbyunits(1,function(t,o) { return o != targetunit; });
		this.selectunit(p,function(p,k) {
		    p[k].log("+%1 %HIT% [%0]",self.name,1);
		    p[k].resolvehit(1); 
		    p[k].checkdead();
		},["select unit [%0]",self.name],false);
	    });
	},
    },
    {
        name: "Intimidation",
	done:true,
	rating:1,
        init: function(sh) {
	    var unit=this.unit;
	    var self=this;
	    Unit.prototype.wrap_after("getagility",this,function(a) {
		if (!unit.dead&&this.isenemy(unit)&&a>0&&(typeof this.touching!="undefined")) 
		    if (this.touching.indexOf(unit)>-1) {
			this.log("-1 agility [%0]",self.name);
			return a-1;
		    }
		return a;
	    });
	},
        type: ELITE,
        points: 2,
    },
    {
        name: "Ysanne Isard",
        faction:EMPIRE,
        unique: true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		if (this.criticals.length>0&&this.candoevade()) {
		    this.addevadetoken();
		    this.log("+1 %EVADE% [%0]",self.name);
		}
	    });
	},
	done:true,
        type: CREW,
        points: 4,
        
    },
    {
        name: "Moff Jerjerrod",
        faction:EMPIRE,
        unique: true,
	done:true,
        type: CREW,
        points: 2,
	init: function(sh) {
	    var crew=this;
	    var newdeal=function(c,f,p) {
		if (!crew.isactive) return p;
		var pp=$.Deferred();
		p.then(function(cf) {
		    var i,cr=[];
		    if ((cf.crit.lethal&&this.hull+this.shield<=2&&cf.face==FACEUP)||this.hull+this.shield==1) {
			for (i=0; i<this.upgrades.length; i++) {
			    var upg=this.upgrades[i];
			    if (upg.type==CREW&&upg!=crew&&upg.isactive) cr.push(upg);
			}
			cr.push(crew);
			cr[0].desactivate();
			this.log("discard %0 to remove critical %1 [%2]",cr[0].name,c.name,crew.name);
			pp.resolve({crit:cf.crit,face:FACEDOWN});
			return false;
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    }
	    sh.wrap_after("deal",this,newdeal);
	},
    },
    {
        name: "Ion Torpedoes",
	requires:"Target",
	consumes:true,
        type: TORPEDO,
	firesnd:"missile",
	done:true,
	prehit: function(t,c,h) {
	    t.addiontoken();
	    var r=t.getrangeallunits();
	    for (var i=0; i<r[1].length; i++) {
		squadron[r[1][i].unit].log("+1 ion token [%0]",this.name);
		squadron[r[1][i].unit].addiontoken();
	    }
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},
        points: 5,
        attack: 4,
        range: [2,3],
    },
    {
        name: "Bodyguard",
        faction:SCUM,
	rating:0,
        unique: true,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("begincombatphase",this,function() {
		var p=this.selectnearbyally(1,function(a,b) { return a.getskill()<b.getskill(); });
		if (this.canusefocus()) {
		    this.selectunit(p,function(p,k) {
			p[k].wrap_after("getagility",self,function(a) { return a+1; }).unwrapper("endcombatphase"); 
			this.removefocustoken();
		    },["select unit (or self to cancel) [%0]",self.name],true);
		}
	    });
	},
        type: ELITE,
        points: 2,
        
    },
    {
        name: "Calculation",
	done:true,
	rating:1,
        init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.canusefocus()&&self.isactive;
		}.bind(sh),
		aiactivate: function(m,n) {
		    return FCH_focus(m);
		},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    this.removefocustoken();
		    displayattacktokens(this);
		    if (f>0) {
			this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
			return m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(sh),str:"focus"});
	},   
        type: ELITE,
        points: 1,
    },
    {
        name: "Accuracy Corrector",
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("modifyattackroll",this,function(d,m,n,m2) {
		if (FCH_hit(m2)+FCH_crit(m2)<2) return FCH_HIT*2;
		return m2;
	    });
	    sh.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return self.isactive; 
		},
		aiactivate: function(m,n) {
		    return FCH_hit(m)+FCH_crit(m)<2;
		},
		f:function(m,n) {
		    this.log("replace all dice by 2 %HIT% [%0]",self.name);
		    return {m:2,n:2};
		}.bind(sh),str:"hit"});
	},                
	done:true,
        type: SYSTEM,
        points: 3,
    },
    {
        name: "Inertial Dampeners",
	done:true,
        init: function(sh) {
	    var upg=this;
	    sh.wrap_after("updateactivationdial",this,function() {
		this.addactivationdial(function() { 
		    return !this.hasmoved&&upg.isactive&&!this.hasionizationeffect();
		}.bind(this),function() {
		    upg.desactivate();
		    this.addstress();
		    this.wrap_after("getmaneuver",upg,function(m) {
			return {move:"F0",difficulty:"WHITE"};
		    }).unwrapper("endactivationphase");
		    this.show();
		}.bind(this), A[ILLICIT.toUpperCase()].key,$("<div>").attr({class:"symbols"}));
		return this.activationdial;
	    });
	},
        type: ILLICIT,
        points: 1,
    },
    { name:"Tractor Beam",
      type:CANNON,
      points:1,
      attack:3,
      done:true,
      modifyhit: function(ch) { return 0; },
      prehit: function(t,c,h) {
	  this.unit.hitresolved=0;
	  this.unit.criticalresolved=0;
	  t.log("+1 tractor beam token [%0]",this.name);
	  t.addtractorbeam(this.unit);
      },
      range:[1,3]
    },
    {
        name: "Flechette Cannon",
        type: CANNON,
	firesnd:"slave_fire",
	done:true,
	modifyhit:function(ch) { return FCH_HIT;},
	prehit: function(t,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    t.log("+1 %HIT%, +1 %STRESS% [%0]",this.name);
	    if (t.stress==0) t.addstress();
	},
        points: 2,
        attack: 3,
        range: [1,3],
    },
    {
        name: "'Mangler' Cannon",
        type: CANNON,
	firesnd:"slave_fire",
        points: 4,
        attack: 3,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    if (sh.weapons[sh.activeweapon]==this) return self.isactive;
		    return false;
		}.bind(this),
		aiactivate: function(m,n) {
		    return FCH_hit(m)>0;
		},
		f:function(m,n) {
		    if (FCH_hit(m)>0) {
			this.log("1 %HIT% -> 1 %CRIT% [%0]",self.name);
			return m+FCH_CRIT-FCH_HIT;
		    }
		    return m;
		}.bind(sh),str:"hit"});
	},
        range: [1,3],
    },
    {
        name: "Dead Man's Switch",
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("dies",this,function() {
		var r=sh.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].log("+%1 %HIT% [%0]",self.name,1);
		    squadron[r[1][i].unit].applydamage(1);
		}
	    });
	},
        type: ILLICIT,
        points: 2,
    },
    {
        name: "Feedback Array",
        type: ILLICIT,
	done:true,
	range:[1,1],
	isTurret:function() { return true; },
	issecondary:false,
	firesnd:"missile",
	isWeapon:function() { return true; },
	declareattack: function(target) { 
	    this.unit.addhasfired();
	    this.unit.resolvehit(1);
	    this.unit.addiontoken();
	    SOUNDS.explode.play();
	    this.unit.log("-1 %HIT%, +1 %ION% [%0]",this.name);
	    target.log("-1 %HIT% [%0]",this.name);
	    target.resolvehit(1);
	    target.checkdead();
	    this.unit.checkdead();
	    this.unit.hasdamaged=true;
	    this.unit.cancelattack();
	    return false;
	},
        init: function(sh) {
	    var self=this;
	    this.toString=Upgrade.prototype.toString;
	},
        points: 2,
    },
    {
        name: "'Hot Shot' Blaster",
	done:true,
        isWeapon: function() { return true;},
	isTurret:function() { return true;},
	endattack: function(c,h) { this.desactivate(); },
        type: ILLICIT,
	firesnd:"xwing_fire",
        points: 3,
        attack: 3,
        range: [1,2],
    },
    {
        name: "Greedo",
        faction:SCUM,
        unique: true,
	done:true,
        type: CREW,
	init: function (sh) {
	    sh.greedoa=-1;
	    sh.greedod=-1;
	    var self=this;
            sh.wrap_before("hashit",self,function(t,r) {
		if (self.unit.greedoa<round)
		    t.wrap_after("deal",self,function(crit,face,p) {
			if (self.unit.greedoa<round) {
			    self.unit.greedoa=round;
			    this.log("first damage is a faceup damage [%0]",self.name);
			    dd=$.Deferred();
			    return dd.resolve({crit:crit,face:FACEUP}).promise();
			}
			return p;
		    }).unwrapper("endbeingattacked");
		return r;
	    });
	    sh.wrap_after("resolveishit",self,function() {
		if (this.greedod<round)
		    this.wrap_after("deal",self,function(crit,face,p) {
			if (this.greedod<round) {
			    this.greedod=round;
			    this.log("first damage is a faceup damage [%0]",self.name);
			    dd=$.Deferred();
			    return dd.resolve({crit:crit,face:FACEUP}).promise();
			}
			return p;
		    }).unwrapper("endbeingattacked");
	    });
	},
        points: 1,
    },
    {
        name: "Salvaged Astromech",   
        type: SALVAGED,
	done:true,
        points: 2,
	init: function(sh) {
	    var self=this;
	    var newdeal=function(c,f,p) {
		if (!self.isactive) return p;
		var pp=$.Deferred();
		p.then(function(cf) {
		    if (cf.crit.type=="ship"&&cf.face==FACEUP) {
			self.desactivate();
			this.log("remove critical %0 [%1]",cf.crit.name,self.name);
			pp.resolve({crit:cf.crit,face:DISCARD});
		    } else pp.resolve(cf);
		}.bind(this));
		return pp.promise();
	    };
	    sh.wrap_after("deal",this,newdeal);
	},
    },
    {
        name: "Bomb Loadout",
        upgrades:[BOMB],
	done:true,
	firesnd:"missile",
	isWeapon: function() { return false; },
        limited: true,
        type: TORPEDO,
        points: 0,
        ship: "Y-Wing"
    },
    {
        name: "'Genius'",
        unique: true,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		var p=[];
		if (this.lastdrop==round) return;
		for (var i=0; i<this.bombs.length; i++) {
		    var b=this.bombs[i];
		    if (typeof b.action=="undefined"&&b.isactive) {
			p.push({type:"BOMB",name:b.name,org:self,action:function(n) {
			    this.actiondrop(n);
			}.bind(b)});
		    }
		}
		this.donoaction(p,"",true);
	    });
	},
        type: SALVAGED,
        points: 0,
    },
    {
        name: "Unhinged Astromech",
        type: SALVAGED,
	done:true,
        install: function(sh) {
	    var save=[];
	    var self=this;
	    sh.installed=true;
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) {
		    for (var i=0; i<gd.length; i++) {
			var d=gd[i].difficulty;
			var move=gd[i].move;
			if (move.match(/[A-Z]+3/)) {
			    //this.log("%0 is green [%1]",move,self.name);
			    d="GREEN";
			}
			save[i]={move:move,difficulty:d};
		    }
		}
		return save;
	    });
	},
	uninstall:function(sh) {
	    if (typeof sh.getdial.unwrap=="function")
		sh.getdial.unwrap(this);
	},
        points: 1,
    },
    {
        name: "R4-B11",
        unique: true,
        type: SALVAGED,
        points: 3,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
		req: function(m,n) { return  (this.targeting.indexOf(targetunit)>-1); }.bind(sh),
		f:function(m,n) {
		    var e=FE_evade(m);
		    var f=FE_focus(m);
		    if (!targetunit.canusefocus()) f=0;
		    this.removetarget(targetunit);
		    if (e+f>0) {
			targetunit.log("Reroll %0 %EVADE%, %1 %FOCUS% [%2]",e,f,self.name);
			var roll=targetunit.rolldefensedie(f,self,"evade");
			m-=FE_EVADE*e+FE_FOCUS*f;
			for (var i=0; i<f+e; i++) {
			    if (roll[i]=="evade") m+=FE_EVADE;
			    if (roll[i]=="focus") m+=FE_FOCUS;
			}
		    }
		    return m;
		}.bind(sh),str:"target"});
	},
    },
    {
        name: "Autoblaster Turret",
        type: TURRET,
	firesnd:"falcon_fire",
	done:true,
        points: 2,
        attack: 2,
	declareattack: function(target) {
	    var self=this;
	    target.wrap_after("cancelhit",self,function(r,org,r2) {
		self.unit.log("%HIT% cannot be cancelled [%0]",self.name);
		return r;
	    }).unwrapper("afterdefenseeffect");
	    return Weapon.prototype.declareattack.call(this,target);
	},
        range: [1,1],
    },
    {
        name: "R4 Agromech",
	done:true,
        init: function(sh) {
	    var self=this;
	    this.spendfocus=false;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) { return self.spendfocus; }.bind(sh),
		f:function(m,n) { 
		    self.spendfocus=false;
		    this.addtarget(targetunit); 
		    this.log("+1 %TARGET% / %1 [%0]",self.name,targetunit.name);
		    displayattacktokens2(this);
		    return m; 
		}.bind(sh),str:"target"});
	    sh.wrap_before("resolveattack",this,function(w,target) {
		self.spendfocus=false;
		this.wrap_before("removefocustoken",self,function() {
		    self.spendfocus=true;
		    //this.addtarget(target);
		    displayattacktokens2(this);
		    this.log("+1 %TARGET% / %1 [%0]",self.name,target.name);
		}).unwrapper("endattack");
	    });
	},
        type: SALVAGED,
        points: 2,
    },
    {
        name: "K4 Security Droid",
        faction:SCUM,
        type: CREW,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_before("handledifficulty",this,function(d) {
		if (d=="GREEN")
		    this.selectunit(this.gettargetableunits(3),function(p,k) {
			this.addtarget(p[k]);
			this.log("+1 %TARGET% / %1 [%0]",self.name,p[k].name);
		    },["select unit (or self to cancel) [%0]",self.name],true);
	    });
	},
        points: 3,
    },
    {
        name: "Outlaw Tech",
        faction:SCUM,
	beta:true,
        limited: true,
	done:true,
        type: CREW,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		if (d=="RED") {
		    sh.log("+1 %FOCUS% [%0]",self.name);
		    sh.addfocustoken();
		}
	    });
	},
        points: 2,
    },
    {
        name: "Advanced Targeting Computer",
        type: SYSTEM,
        points: 5,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return this.targeting.indexOf(targetunit)>-1&&self.isactive==true; 
		}.bind(sh),
		f:function(m,n) {
		    if (this.targeting.indexOf(targetunit)>-1) {
			this.log("+1 %CRIT% [%0]",self.name);
			$("#atokens > .xtargettoken").remove();
			return {m:m+10,n:n+1};
		    } else return {m:m,n:n};
		}.bind(sh),str:"critical"})
	},
        ship: "TIE Advanced",
	done:true
    },
    {
        name: "Stealth Device",
	type:MOD,
	done:true,
	install:function(sh) {
	    sh.wrap_after("getagility",this,function(a) { return a+1;});
	    sh.showstats();
	},
	uninstall:function(sh) {
	    if (typeof sh.getagility.unwrap=="function") {
		sh.getagility.unwrap(this);
	    }
	    sh.showstats();
	},
	init: function(sh) {
	    var upg=this;
	    sh.log("+1 agility [%0]",upg.name)
	    sh.wrap_before("resolveishit",this,function(t) {
		if (!upg.isactive) return;
		upg.uninstall(this);
		upg.desactivate(); 
		this.log("%0 is hit => destroyed",upg.name);
		this.show();
	    })
	},
        points: 3,
    },
    {
        name: "Shield Upgrade",
	type:MOD,    
	done:true,
	install: function(sh) {
	    sh.installed=true;
	    sh.shield++; sh.ship.shield++;
	    sh.showstats();
	},
	uninstall:function(sh) {
	    sh.shield--; sh.ship.shield--;
	    sh.showstats();
	},
        points: 4,
    },
    {
        name: "Engine Upgrade",
	type:MOD,
	done:true,
	addedaction:"Boost",
        points: 4,
    },
    {
        name: "Anti-Pursuit Lasers",
	type:MOD,
        islarge:true,
	done:true,
        points: 2,
	init: function(sh) {
	    var upg=this;
	    sh.wrap_before("collidedby",this,function(t) {
		if (upg.isactive&&t.isenemy(this)) {
		    var roll=this.rollattackdie(1,upg,"hit")[0];
		    if (roll=="hit"||roll=="critical") {
			t.log("+%1 %HIT% [%0]",upg.name,1) 
			t.resolvehit(1);
			t.checkdead();
		    } else t.log("no effect [%0]",upg.name);
		}
	    });
	}
    },
    {
        name: "Targeting Computer",
	type:MOD,
	done:true,
	addedaction:"Target",
        points: 2,
    },
    {
        name: "Hull Upgrade",
	type:MOD,
	done:true,
        install: function(sh) {
	    sh.hull++; sh.ship.hull++;
	    sh.installed=true;
	    sh.showstats();
	},     
	uninstall:function(sh) {
	    sh.hull--; sh.ship.hull--;
	    sh.showstats();
	},
        points: 3,
    },
    {
        name: "Munitions Failsafe",
	type:MOD,
        init: function(sh) {
	    var self=this;
	    sh.addafterattackeffect(this,function(c,h) {
		if (!this.weapons[this.activeweapon].isprimary&&(c+h==0)) {
		    this.log("%0 still active [%1]",this.weapons[this.activeweapon].name,self.name);
		    this.weapons[this.activeweapon].isactive=true;
		    this.show();
		}
	    })
	},
	done:true,
        points: 1,
    },
    {
        name: "Stygium Particle Accelerator",
	type:MOD,
	done:true,
        init: function(sh) {
	    sh.wrap_after("resolvedecloak",this,function() {
		if (this.candoevade()) {
		    this.doaction([this.newaction(this.addevade,"EVADE")],
				  "Stygium P.A.: +1 %EVADE%");
		}
		return true;
	    });
	    sh.wrap_after("addcloak",this,function(n) {
		if (this.candoevade()) 
		    this.doaction([this.newaction(this.addevade,"EVADE")],
				  "Stygium P.A.: +1 %EVADE%");
	    })
	},
        points: 2,
    }, 
    {
        name: "Advanced Cloaking Device",
	type:MOD,
        points: 4,
	done:true,
	init: function(sh) {
	    var upg=this;
	    sh.addafterattackeffect(this,function() {
		if (this.candoaction()&&this.candocloak()) {
		    this.doaction([this.newaction(this.addcloak,"CLOAK")],upg.name+": free cloack action");
		}
	    });
	},
        ship: "TIE Phantom",
    },
    {
        name: "B-Wing/E2",
	type:MOD,
	done:true,
        upgrades:[CREW],
        points: 1,
        ship: "B-Wing",
	install: function(sh) {
	    sh.shipimg="b-wing-1.png";
	},
	uninstall: function(sh) {
	    sh.shipimg="b-wing-2.png";
	},
    },
    {
        name: "Countermeasures",
	type:MOD,
        islarge:true,
	done:true,
	init: function(sh) {
	    var mod=this;/* TODO: same time as attack */
	    sh.wrap_before("begincombatphase",this,function() {
		if (mod.isactive) 
		    this.donoaction([{action:function(n) {
			mod.desactivate();
			this.wrap_after("getagility",mod,function(a) {
			    return a+1;
			}).unwrapper("endphase");
			if (this.istargeted.length>0) {
			    this.log("select a lock to remove [%0]",mod.name);
			    this.resolveactionselection(this.istargeted,function(k) { 
				this.istargeted[k].removetarget(this);
				this.endnoaction(n,"MOD");
			    }.bind(this));
			} else this.endnoaction(n,"MOD");
		    }.bind(this),type:mod.type.toUpperCase(),name:mod.name}],"",true);
	    });
	},
        points: 3,
    },
    {
        name: "Experimental Interface",
	type:MOD,
        unique: true,
        points: 3,
	init: function(sh) {
	    var upg=this;
	    upg.r=-1;
	    sh.wrap_before("endaction",this,function(n,type) {
		if (upg.r!=round&&this.candoaction()&&type!=null) {
		    upg.r=round;
		    this.doaction(this.getupgactionlist(),"+1 free action (Skip to cancel)").done(function(type2) {
			if (type2==null) upg.r=-1;
			else this.addafteractions(function() { this.addstress(); }.bind(this));
		    }.bind(this));
		}
	    });
	},
	done:true
    },
    {
        name: "Tactical Jammer",
	type:MOD,
        islarge:true,
        points: 1,
	done:true,
	init: function(sh) {
	    var self=this;
	    Unit.prototype.wrap_after("getobstructiondef",this,function(t,ob) {
		if (!self.unit.dead&&this.isenemy(sh)&&ob==0) {
		    OBSTACLES.push(sh);
		    ob=this.getoutlinerange(this.m,t).o?1:0;
		    OBSTACLES.splice(OBSTACLES.indexOf(sh),1);
		    if (ob==1) this.log("fire obstructed by %0",sh.name)
		}
		return ob;
	    });
	}
    },
    {
        name: "Autothrusters",
	type:MOD,
        actionrequired:"Boost",
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("modifydefenseroll",this,function(attacker,m,n,ch) {
		if (attacker.getsector(this)>2&&FE_blank(ch,n)>0) ch= ch+FE_EVADE;
		return ch;
	    });
	    sh.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    if (activeunit.getsector(this)>2) return self.isactive;
		    return false;
		}.bind(sh),
		f:function(m,n) {
		    var b=FE_blank(m,n);
		    if (b>0) {
			this.log("1 blank -> 1 %EVADE% [%0]",self.name);
			m=m+FE_EVADE;
		    }
		    return m;
		}.bind(sh),
		str:"blank"});
	}
    },
    {
        name: "Slave I",
        type:TITLE,
        unique: true,
        points: 0,
	done:true,
        ship: "Firespray-31",
	upgrades:[TORPEDO],
    },
    {
        name: "Millennium Falcon",
        type:TITLE,
	done:true,
	addedaction:"Evade",
        unique: true,
        points: 1,
        ship: "YT-1300",
    },
    {
        name: "Moldy Crow",
        type:TITLE,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("resetfocus",this,function() {
		if (this.focus>0) this.log("keep %FOCUS% tokens [%0]",self.name);
		return this.focus;
	    });
	},
        unique: true,
	done:true,
        points: 3,
        ship: "HWK-290",
    },
    {
        name: "ST-321",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("gettargetableunits",this,function(n) {
		var p=[];
		for (i in squadron) 
		    if (squadron[i].isenemy(this)) p.push(squadron[i]);
		return p;
	    });
	},
        unique: true,
        points: 3,
        ship: "Lambda-Class Shuttle",
    },
    {
        name: "Royal Guard TIE",
        type:TITLE,
	done:true,
        upgrades:[MOD],
	skillmin:5,
        points: 0,
	install: function(sh) {
	    sh.shipimg="tie-interceptor-1.png";
	},
	uninstall: function(sh) {
	    sh.shipimg="tie-interceptor-2.png";
	},
        ship: "TIE Interceptor",
    },
    {
        name: "A-Wing Test Pilot",
        type:TITLE,
	done:true,
        upgrades:[ELITE],
	skillmin:2,
        points: 0,
        ship: "A-Wing",
	exclusive:true,
	install: function(sh) {
	    sh.shipimg="a-wing-1.png";
	},
	uninstall:function(sh) {
	    sh.shipimg="a-wing-2.png";
	},
    },
    {
        name: "Outrider",
        type:TITLE,
	done:true,
        install: function(sh) {
	    var i;
	    for (i=0; i<sh.weapons.length; i++) {
		if (sh.weapons[i].type==CANNON) {
		    sh.weapons[0].desactivate();
		    sh.log("primary weapon inactive [%0]",this.name);
		    sh.weapons[i].isTurret= function() { return true; };
		    sh.log("%0 can fire in 360 degrees [%0]",sh.weapons[i].name,this.name);
		    break;
		}
	    }
	},
	uninstall: function(sh) {
	    sh.weapons[0].isactive=true;
	    for (var i=0; i<sh.weapons.length; i++) 
		if (sh.weapons[i].type==CANNON) 
		    sh.weapons[i].isTurret = function() { return false; };
	},
        unique: true,
        points: 5,
        ship: "YT-2400",
    },
    {
        name: "Dauntless",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var self=this;
	    sh.wrap_after("doendmaneuveraction",this,function() {
		if (this.candoaction()&&this.collision) {
		    this.log("+1 free action [%0]",self.name);
		    this.doaction(this.getactionlist(),"").done(function(t) {
			if (t!=null) this.addstress();
		    }.bind(this));
		}
	    });
	},
        unique: true,
        points: 2,
        ship: "VT-49 Decimator",
    },
    {
        name: "Virago",
        type:TITLE,
	done:true,
        upgrades:[ILLICIT,SYSTEM],
        unique: true,
        points: 1,
	skillmin:4,
        ship: "StarViper",
    },
    { /* v423 */
        name: "'Heavy Scyk' Interceptor",
	done:true,
        upgrades:["Cannon|Torpedo|Missile"],
        type:TITLE,
        points: 2,
        ship: "M3-A Interceptor", 
	install: function(s) {
	    s.ship.hull++;
	    s.installed=true;
	    s.showstats();	    
	},
	init: function(sh) {
	    this.wrap_after("uninstall",this,function(s) {
		/*s.hull--; */
		s.ship.hull--;
		s.showstats();
	    });
	},
    },
    {
        name: 'IG-2000',
        type:TITLE,
	done:true,
        install:function(sh) { sh.ig2000=true;	},
	uninstall:function(sh) { sh.ig2000=false; },
	init: function(sh) {
	    for (var i in squadron) {
		var u=squadron[i];
		if (u!=sh&&u.ig2000==true&&u.isally(sh)) {
		    sh.log("copying %0 abilities [%1]",u.name,this.name);
		    u.init.call(sh,u);
		}
	    }
	},
        points: 0,
        ship: "Aggressor",
    },
    {
        name: "BTL-A4 Y-Wing",
        type:TITLE,
	done:true,
        init: function(sh) {
	    var turret=[];
	    var self=this;
	    for (var i=0; i<sh.weapons.length; i++) {
		var w=sh.weapons[i];
		if (w.type==TURRET&&w.isprimary==false) {
		    turret.push(w);
		    w.wrap_after("isTurret",self,function() { return false; });
		}
	    }
	    if (turret.length==0) return;
	    sh.wrap_after("isTurret",this,function(w,b) {
		return false;
	    });
	    //sh.weapons[0].followupattack=function() { return sh.indexOf(turret[0]); };
	    sh.addattack(function(c,h) { 
		return this.weapons[this.activeweapon].isprimary;
	    },self,turret); 
	},
        points: 0,
        ship: "Y-Wing",
    },
    {
        name: "Andrasta",
        type:TITLE,
	done:true,
        upgrades:[BOMB,BOMB],
        unique: true,
        points: 0,
        ship: "Firespray-31",
    },
    {
        name: "TIE/x1",
        type:TITLE,
	done:true,
        upgrades:[SYSTEM],
	pointsupg:-4,
        points: 0,
        ship: "TIE Advanced",
    },
    {
        name: "Emperor Palpatine",
        type:CREW,
	unique:true,
	takesdouble:true,
	done:true,
        points: 8,
        faction: EMPIRE,
	init: function() {
	    var self=this;
	    self.unit.emperor=-1;
	    var replace=function(n,org,best,tab) {
		if (self.unit.isally(this)&&!self.unit.dead
		    &&typeof  best!="undefined"
		    &&self.unit.emperor<round) {
		    for (var i=0; i<tab.length; i++) if (tab[i]!=best) break;
		    if (i<tab.length&&
			confirm("Emperor Palpatine effect\n"
				+org.name+": "+tab[0]+" die -> "+best+" die ?")) {
			self.unit.log("%0 -> %1 [%2]",tab[i],best,self.name);
			tab[i]=best;
			self.unit.emperor=round;
		    }
		}
		if (typeof best!="undefined") return tab;
		else return org;
	    }
	    Unit.prototype.wrap_after("rollattackdie",self,replace);
	    Unit.prototype.wrap_after("rolldefensedie",self,replace);
	    Unit.prototype.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return !self.unit.dead&&self.unit.emperor<round&&activeunit.isally(self.unit);
		},
		f:function(m,n) {
		    self.unit.emperor=round;
		    var f=FCH_focus(m);
		    var b=FCH_blank(m,n);
		    var h=FCH_hit(m);
		    if (b>0) {
			activeunit.log("blank -> %CRIT% [%0]",self.name);
			m=m+FCH_CRIT;
			self.round=round;
		    } else if (f>0) {
			activeunit.log("%FOCUS% -> %CRIT% [%0]",self.name);
			m=m-FCH_FOCUS+FCH_CRIT;
		    } else if (h>0) {
			activeunit.log("%HIT% -> %CRIT% [%0]",self.name);
			m=m-FCH_HIT+FCH_CRIT;
		    }
		    return m;
		},str:"crew"});
	    Unit.prototype.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return !self.unit.dead&&targetunit.isally(self.unit)&&self.unit.emperor<round;
		},
		f:function(m,n) {
		    self.unit.emperor=round;
		    var f=FE_focus(m);
		    var b=FE_blank(m,n);
		    if (b>0) {
			targetunit.log("blank -> %EVADE% [%0]",self.name);
			m=m+FE_EVADE;
		    } else if (f>0) {
			targetunit.log("%FOCUS% -> %EVADE% [%0]",self.name);
			m=m+FE_EVADE-FE_FOCUS;
		    }
		    return m;
		},str:"crew"});
	}
    },
    {
        name: "Extra Munitions",
        type: TORPEDO,
        limited: true,
	firesnd:"missile",
	isWeapon: function() { return false; },
        points: 2,
	done:true,
	init: function(sh) { 
	    for (var i=0; i<sh.upgrades.length; i++) {
		var u=sh.upgrades[i];
		if (u.type.match(/Missile|Torpedo|Bomb/)) u.ordnance=true;
	    }
	},
    },
    { // updated v423
        name: "Cluster Mines",
        type: BOMB,
	snd:"explode",
	img:"cluster.png",
	width: 15,
	height:10,
	repeatx:42,
	size:22,
	stay:true,
	done:true,
        getOutlineStringsmall: function(m) {
	    var N=20;
	    var s="M ";
	    this.op=[];
	    if (typeof m=="undefined") m=this.m;
	    for (var i=0; i<N; i++){ 
		var p=transformPoint(m,{
		    x:this.size*Math.sin(2*i*Math.PI/N),
		    y:this.size*Math.cos(2*i*Math.PI/N)});
		this.op.push(p);
		s+=p.x+" "+p.y+" ";
		if (i==0) s+="L ";
	    }
	    s+="Z";
	    return {s:s,p:this.op};
	},
	candoaction: function() { return  this.unit.lastdrop!=round&&this.isactive; },
	action: function(n) {   this.actiondrop(n);  },
	canbedropped: function() { return false; },
        explode: function() {},
	detonate: function(t) {
	    if (!this.exploded) {
		var roll=this.unit.rollattackdie(2,this,"hit");
		for (var i=0; i<2; i++) {
		    if (roll[i]=="hit"||roll[i]=="critical") {
			t.log("+1 %HIT% [%0]",this.name); 
			t.resolvehit(1); 
			t.checkdead(); 
		    }
		}
		Bomb.prototype.detonate.call(this);
	    }
	},
	display: function(x,y) {
	    this.getOutlineString=this.getOutlineStringsmall;
	    var b1=$.extend({},this);
	    var b2=$.extend({},this);
	    Bomb.prototype.display.call(b1,this.repeatx,0);
	    Bomb.prototype.display.call(b2,-this.repeatx,0);
	    Bomb.prototype.display.call(this,0,0);
	},
	init: function(u) {
	    var p=s.path("M41.844,-21 C54.632,-21 65,-11.15 65,1 C65,13.15 54.632,23 41.844,23 C33.853,22.912 25.752,18.903 21.904,12.169 C17.975,18.963 10.014,22.806 1.964,23 C-7.439,22.934 -14.635,18.059 -18.94,10.466 C-22.908,18.116 -30.804,22.783 -39.845,23 C-52.633,23 -63,13.15 -63,1 C-63,-11.15 -52.633,-21 -39.845,-21 C-30.441,-20.935 -23.246,-16.06 -18.94,-8.466 C-14.972,-16.116 -7.076,-20.783 1.964,-21 C9.956,-20.913 18.055,-16.902 21.904,-10.17 C25.832,-16.964 33.795,-20.807 41.844,-21 z").attr({display:"none"});
	    var l=p.getTotalLength();
	    this.op0=[];
	    for (var i=0; i<60; i++) {
		this.op0[i]=p.getPointAtLength(i*l/60);
	    }
	},
	getOutlineString: function(m) {
	    var N=60;
	    var s="M ";
	    this.op=[];
	    if (typeof m=="undefined") m=this.m;
	    for (var i=0; i<N; i++){ 
		var p=transformPoint(m,this.op0[i]);
		this.op.push(p);
		s+=p.x+" "+p.y+" ";
		if (i==0) s+="L ";
	    }
	    s+="Z";
	    return {s:s,p:this.op};
	},
        points: 4,
    },
    {
        name: "Glitterstim",
        type: ILLICIT,
        points: 2,
	activated: -1,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.glitter=-1;
	    sh.wrap_after("begincombatphase",this,function(lock) {
		if (self.isactive) {
		    this.donoaction([
			{org:self,name:self.name,type:"ILLICIT",action:function(n) {
			    this.addstress();
			    this.glitter=round;
			    this.endnoaction(n,"ILLICIT");
			}.bind(this)}],"",true);
		}
		return lock;
	    });
	    sh.wrap_before("endphase",this,function() {
		if (this.glitter==round) self.desactivate();
	    });
	    /*TODO: to change into canchangefocusdice
	      sh.wrap_after("canusefocus",this,function(r) {
		return r||(this.glitter==round);
	    });*/
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return this.glitter==round&&self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.log("%1 %FOCUS% -> %1 %HIT% [%0]",self.name,f);
			m=m-FCH_FOCUS*f+f*FCH_HIT;
		    }
		    return m;
		}.bind(sh),str:"focus",noreroll:"focus"});
	    sh.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return this.glitter==round&&self.isactive;
		}.bind(sh),
		f:function(m,n) {
		    var f=FE_focus(m);
		    if (f>0) {
			this.log("%1 %FOCUS% -> %1 %EVADE% [%0]",self.name,f);
			m=m-FE_FOCUS*f+FE_EVADE*f;
		    }
		    return m;
		}.bind(sh),str:"focus",noreroll:"focus"});
	},
    },
    {
        name: "Cloaking Device",
	type:ILLICIT,
	islarge:false,
        points: 2,
	candoaction: function() { return this.isactive&&!this.unit.iscloaked; },
	action: function(n) {
	    var self=this.unit;
	    self.log("cloaked [%0]",this.name);
	    self.addcloak(n);
	},
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("endphase",this,function() {
		if (!self.isactive) return;
		var roll=this.rollattackdie(1,self,"blank")[0];
		if (roll=="focus"&&this.iscloaked&&self.isactive==true) {
		    this.log("%0 failed -> decloaking",self.name);
		    this.resolvedecloak(true);
		    self.desactivate();
		} else this.log("%0 still working",self.name);
	    });
	},
    },
    
    {
        name: "Bossk",
        unique: true,
        faction: SCUM,
        type: CREW,
        points: 2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("hashit",this,function(t,b) {
		if (!b) {
		    this.log("+1 stress, +1 %FOCUS%, +1 %TARGET% [%0]",self.name);
		    if (this.stress==0) this.addstress();
		    if (this.gettargetableunits(3).indexOf(t)>-1) 
			this.addtarget(t);
		    else this.log("no valid target [%0]",self.name);
		    this.addfocustoken();
		}
		return b;
	    });
	},
    },
    { name:"Wired",
      type: ELITE,
      init: function(sh) {
	  var self=this;
	  var req=function() {
	      if (this.stress>0) {
		  this.log("+%1 %FOCUS% reroll(s) [%0]",self.name,this.focus);
		  return self.isactive;
	      } else return false;
	  }.bind(sh);
	  sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
	      dice:["focus"],
	      n:function() { return 9; },
	      req:req});
	  sh.adddicemodifier(DEFENSE_M,REROLL_M,DEFENSE_M,this,{
	      dice:["focus"],
	      n:function() { return 9; },
	      req:req});
      },
      done:true,
      points:1,
    },
    { name:"Cool Hand",
      type: ELITE,
      points:1,
      rating:1,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("addstress",this,function() {
	      if (!self.isactive) return;
	      this.donoaction([{type:"FOCUS",name:self.name,org:self,
				action:function(n) {
				    self.desactivate();
				    this.addfocustoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)},
			       {type:"EVADE",name:self.name,org:self,
				action:function(n) {
				    self.desactivate();
				    this.addevadetoken();
				    this.endnoaction(n,"ELITE");
				}.bind(this)}],
			      "Add %EVADE% or %FOCUS% instead of %STRESS% token",
			      true);
	  });
      },
    },
    { name:"Juke",
      rating:2,
      type: ELITE,
      points:2,
      islarge:false,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	      req:function() { return self.unit.evade>0; },
	      f:function(m,n) {
		  if (FE_evade(m)>0) {
		      targetunit.log("%EVADE% -> %FOCUS% [%0]",self.name); 
		      m=m-FE_EVADE+FE_FOCUS;
		  }
		  return m;
	      },str:"evade"});
	  sh.wrap_after("setpriority",this,function(a) {
	      if (a.type=="EVADE"&&this.evade==0) a.priority=10;
	  });
      }
    },
    {
        name: "Lightning Reflexes",
        type: ELITE,
	rating:1,
        points: 1,
	done:true,
	init: function(sh) {
	    var u=this;
	    sh.wrap_after("handledifficulty",this,function(d) {
		if ((d=="WHITE"||d=="GREEN")&&u.isactive) {
		    this.donoaction([{type:"ELITE",name:u.name,org:u,action:function(n) {
			u.desactivate();
			this.addstress(1);
			this.m=this.m.rotate(180,0,0);
			this.show();
			this.endnoaction(n,ELITE);
		    }.bind(this)}],"",true);
		};
	    });
	},
	islarge:false,
    },
    {
	name: "Twin Laser Turret",
	type: TURRET,
	firesnd:"falcon_fire",
	points: 6,
	done:true,
	attack: 3,
	range: [2,3],
	followupattack: function() { return this.unit.weapons.indexOf(this); },
	modifyhit:function(ch) { return FCH_HIT;},
	prehit: function(target,c,h) {
	    this.unit.hitresolved=1;
	    this.unit.criticalresolved=0;
	    target.log("+%1 %HIT% [%0]",this.name,1);
	},
	hasdoubleattack:function() {
	    this.twinattack=!this.twinattack;
	    return this.twinattack;
	},
	init: function(sh) {
	    this.twinattack=false;
	}
    },
    {
        name: "Plasma Torpedoes",
        type: TORPEDO,
        points: 3,
        attack: 4,
	firesnd:"missile",
	requires:"Target",
	consumes:true,
	done:true,
	posthit: function(t,c,h) {
	    if (t.shield>0) t.log("-1 %SHIELD% [%0]",this.name);
	    t.removeshield(1);
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},
        range: [2,3]
    },
    {
	name: "Ion Bombs",
	type: BOMB,
	points: 2,
	width: 14,
	height:14,
	size:15,
	done:true,
	snd:"explode",
	img:"ion.png",
	explode:function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    squadron[r[1][i].unit].addiontoken();
		    squadron[r[1][i].unit].addiontoken();
		}
		this.explode_base();
	    }
	}
    },
    {
        name: "Conner Net",
        type: BOMB,
	snd:"explode",
	img:"conner-net3.png",
	width:40,
	height:60,
	size:40,
	done:true,
	init: function() {
	    this.conner=-1;
	    var p=s.path("M-11.379,-0.26 C-11.241,-6.344 -16.969,-14.641 -19.247,-20.448 C-21.524,-26.255 -24.216,-38.147 -20.213,-39.46 C-16.21,-40.774 -8.619,-37.594 2.424,-37.663 C13.466,-37.732 22.162,-41.327 23.68,-39.322 C25.198,-37.317 26.716,-30.404 22.714,-21.278 C18.711,-12.152 14.156,-6.828 14.087,0.293 C14.018,7.414 19.47,15.364 22.3,22.555 C25.129,29.745 25.681,39.908 23.128,41.429 C20.574,42.95 13.673,41.29 4.218,41.29 C-5.237,41.29 -19.316,42.742 -20.903,41.29 C-22.49,39.839 -24.354,34.446 -20.213,23.108 C-16.072,11.769 -11.448,11.424 -11.379,1.606 C-11.322,-6.487 -11.514,5.685 -11.379,-0.26 z").attr({display:"none"});
	    var l=p.getTotalLength();
	    this.op0=[];
	    for (var i=0; i<60; i++) {
		this.op0[i]=p.getPointAtLength(i*l/60);
	    }
	},
	getOutlineString: function(m) {
	    var N=60;
	    var s="M ";
	    this.op=[];
	    if (typeof m=="undefined") m=this.m;
	    for (var i=0; i<N; i++){ 
		var p=transformPoint(m,this.op0[i]);
		this.op.push(p);
		s+=p.x+" "+p.y+" ";
		if (i==0) s+="L ";
	    }
	    s+="Z";
	    return {s:s,p:this.op};
	},
	stay:true,
	candoaction: function() { return this.unit.lastdrop!=round&&this.isactive; },
	action: function(n) {  this.actiondrop(n);  },
	canbedropped: function() { return false; },
	explode: function() {},
	detonate:function(t,immediate) {
	    var self=this;
	    if (!this.exploded) {
		if (immediate) {
		    if (!t.hasmoved) {
			t.log("%1 skips action phase [%0]",self.name,t.name);
			//exploded the round it was dropped
			t.wrap_after("candoendmaneuveraction",self,function() {
			    return false;
			}).unwrapper("endactivationphase");
		    } else {
			t.log("+2 ion tokens next turn [%0]",self.name);
			t.wrap_after("beginplanningphase",this,function(l) {
			    this.log("+2 ion tokens [%0]",self.name);
			    this.addiontoken();
			    this.addiontoken();
			    this.beginplanningphase.unwrap(self);
			    return l;
			});
		    }
		} else {
		    t.wrap_before("cleanupmaneuver",this,function() {
			t.log("+1 %HIT%, +2 ion tokens [%0]",this.name); 
			t.resolvehit(1); 
			t.checkdead(); 
			t.addiontoken();
			t.addiontoken();
			t.log("%1 skips action phase [%0]",this.name,t.name);
		    }).unwrapper("endactivationphase");
		    t.wrap_after("candoendmaneuveraction",this,function() {
			return false;
		    }).unwrapper("endactivationphase");
		}
		Bomb.prototype.detonate.call(this,immediate);
	    }
	},       
	points: 4,
    },
    {
	name: "Bombardier",
	type: CREW,
	points: 1,
	done:true,
	init:function(sh) {
	    sh.wrap_after("getbomblocation",this,function(d) {
		if (d.indexOf("F1")>-1) return d.concat("F2");
		return d;
	    })
	},
    },
    {name:"Agent Kallus",
     type:CREW,
     faction:EMPIRE,
     points:2,
     done:true,
     init: function(sh) {
	 var self=this;
	 this.unit.nemesis=null;
	 sh.wrap_after("beginactivationphase",self,function(l) {
	     if (round==1) {
		 this.selectunit(this.selectnearbyenemy(4),function(p,k) {
		     this.nemesis=p[k];
		     this.log("%0 chosen as nemesis [%1]",p[k].name,self.name);
		 });
	     }
	     return l;
	 },["select unit [%0]",self.name],false);
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,self,{
	     req:function() { return targetunit==this.nemesis; }.bind(sh),
	     f: function(m,n) {
		 var f=FCH_focus(m);
		 if (f>0) {
		     m=m-FCH_FOCUS+FCH_HIT;
		     this.log("1 %FOCUS% -> 1 %HIT% [%0]",self.name);
		 }
		 return m;
	     }.bind(sh),str:"focus"});
	 sh.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,self,{
	     req:function() { return activeunit==this.nemesis; }.bind(sh),
	     f: function(m,n) {
		 var f=FE_focus(m);
		 if (f>0) {
		     m=m-FE_FOCUS+FE_EVADE;
		     this.log("1 %FOCUS% -> 1 %EVADE% [%0]",self.name);
		 }
		 return m;
	     }.bind(sh),str:"focus"});
     }
    },
    {
        name: "'Crack Shot'",
        type: ELITE,
        points: 1,
	rating:3,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACKCOMPARE_M,MOD_M,DEFENSE_M,this,{
		req:function() {
		    return this.isinfiringarc(targetunit)&&self.isactive;
		}.bind(sh),
		aiactivate:function(m,n) {
		    return FE_evade(m)>0;
		},
		f:function(m,n) {
		    self.desactivate();
		    if (FE_evade(m)>0) {
			sh.log("-1 %EVADE% [%0]",self.name);
			m=m-FE_EVADE;
		    } 
		    return m;
		},str:"evade"});
	}
    },
    {
        name: "Advanced Homing Missiles",
        type: MISSILE,
	firesnd:"missile",
        points: 3,
	requires:"Target",
	consumes:false,
        attack: 3,
        range: [2,2],
	done:true,
	modifyhit:function(ch) { return FCH_CRIT;},
	prehit: function(t,c,h) {
	    t.log("+1 %CRIT% [%0]",this.name);
	    t.applycritical(1);
	    this.unit.hitresolved=0;
	    this.unit.criticalresolved=0;
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("setpriority",this,function(a) {
		if (a.type=="TARGET"&&self.isactive&&this.candotarget()) 
		    a.priority+=10;
	    });
	},
    },
    {
	name: "Advanced SLAM",
	type:MOD,
	done:true,
	points: 2,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("resolveslam",this,function() {
		this.doaction(this.getactionlist(),"+1 free action (Skip to cancel) ["+self.name+"]");
	    });
	}
    },
    {
        name: "Twin Ion Engine Mk. II",
	type:MOD,
        points: 1,
	ship: "TIE",
	done:true,
        install: function(sh) {
	    var save=[];
	    sh.installed=true;
	    sh.wrap_after("getdial",this,function(gd) {
		if (save.length==0) 
		    for (var i=0; i<gd.length; i++) {
			var move=gd[i].move;
			var d=gd[i].difficulty;
			if (move.match(/BL\d|BR\d/)) d="GREEN";
			save[i]={move:move,difficulty:d};
		    }
		return save;
	    })
	    sh.wrap_after("getmaneuver",this,function(m) {
		if (m.move.match(/BL\d|BR\d/)) return {move:m.move,difficulty:"GREEN"};
		return m;
	    });
	},
	uninstall:function(sh) {
	    if (typeof sh.getdial.unwrap=="function") 
		sh.getdial.unwrap(this);
	}
    },
    {
        name: "Maneuvering Fins",
	type:MOD,
        points: 1,
        ship: "YV-666",
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("getmaneuverlist",self,function(list) {
		var p=list;
		if (this.hasionizationeffect()) return p;
		for (var i in list) {
		    if (i.match(/TR\d|TL\d/)) {
			this.log("change turn into a bank [%0]",self.name);
			var m=i.replace(/T/,"B");
			p[m]={move:m,difficulty:list[i].difficulty,halfturn:list[i].halfturn};
		    }
		}
		return p;
	    }.bind(sh));
	}
    },
    {
        name: "Hound's Tooth",
        points: 6,
	type:TITLE,
        unique: true,
        ship: "YV-666",
	done:true,
	getdeploymentmatrix:function(u) {
	    var gd=u.getdial();
	    var p=[];
	    for (var i=0; i<gd.length; i++) {
		var m0=this.unit.m.clone().translate(0,20).rotate(180,0,0);
		p.push(u.getpathmatrix(m0,gd[i].move));
	    }
	    for (var i=0; i<gd.length; i++) {
		var m0=this.unit.m.clone().translate(0,-20);
		p.push(u.getpathmatrix(m0,gd[i].move));
	    }
	    return p;
	},
	init: function(sh) {
	    var self=this;
	    // find or clone the pilot
	    var i,found=-1;
	    for (i in squadron) 
		if (squadron[i].name=="Nashtah Pup Pilot") { found=i; break; }
	    if (found>-1) {
		p=squadron[found];
		p.skill=sh.skill;
	    } else {
		for (i=0; i<PILOTS.length; i++) {
		    if (PILOTS[i].name=="Nashtah Pup Pilot") break;
		}
		p=new Unit(sh.team,i);
		p.upg=[];
		p.skill=sh.skill;
		p.tosquadron(s);
		allunits.push(p);
		squadron.push(p);
		TEAMS[sh.team].units.push(p);
	    }
	    p.dock(sh);
	    p.show();
	    sh.wrap_before("dies",self,function() {
		var u=this.docked;
		this.init.call(u); // Copy capacities
		this.hasfired=0;
		u.wrap_before("endphase",u,function() {
		    this.hasmoved=false;
		});
		u.noattack=round;
		u.deploy(this,self.getdeploymentmatrix(u));
	    });
	}
    },
    {
	name: "XX-23 S-Thread Tracers",
	points:1,
	type:MISSILE,
	firesnd:"missile",
	range:[1,3],
	attack:3,
	done:true,
	requires:"Focus",
	consumes:false,
	modifyhit: function(ch) { return 0; },
	prehit:function(t,c,h) {
	    var p=this.unit.selectnearbyally(2);
	    var s="";
	    if (p.length>0) {
		p=p.concat(this.unit);
		for (var i=0; i<p.length; i++) {
		    if (p[i].gettargetableunits(3).indexOf(t)>-1) {
			p[i].addtarget(t);
			s+=p[i].name+" ";
		    } else p[i].log("no valid target [%0]",this.name);
		}
		this.unit.log("all dice cancelled, %0 now targeted by %1",t,s);
		this.unit.hitresolved=0;
		this.unit.criticalresolved=0;
	    }
	}
    },
    { 
	name:"Comm Relay",
	points: 3,
	type:TECH,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("addevadetoken",this,function() {
		if (this.evade>1) {
		    this.log("1 %EVADE% max [%0]",self.name);
		    this.evade=1;
		}
		this.showinfo();
	    });
	    sh.wrap_after("resetevade",this,function() {
		var r=0;
		if (this.evade>0) {
		    this.log("keep 1 %EVADE% token [%0]",self.name);
		    r=1;
		}
		return r;
	    });
	},
    },
    {
	name: "Dorsal Turret",
	type: TURRET,
	points: 3,
	firesnd:"falcon_fire",
	attack: 2,
	range: [1,2],
	done:true,
	getrangeattackbonus: function(sh) {
	    var r=this.getrange(sh);
	    if (r==1) {
		this.unit.log("+1 attack for range 1");
		return 1;
	    }
	    return 0;
	}
    },
    { name:"'Chopper'",
      type:CREW,
      points:0,
      done:true,
      init: function(sh) {
	  /* TODO: check that it works */
	  sh.wrap_after("hasnostresseffect",this,function(b) {
	      return true;
	  });
	  sh.wrap_before("endaction",this,function(n,type) {
	      if (type!=null&&this.stress>0) {
		  this.log("%STRESS% -> +1 %HIT% [%0]",this.name);
		  this.resolvehit(1);
		  this.checkdead();
	      }
	  });
      },
      faction:REBEL,
      unique:true
    },
    { name:"Hera Syndulla",
      type:CREW,
      points:1,
      faction:REBEL,
      done:true,
      init: function(sh) {
	  sh.wrap_after("canreveal",this,function(d,b) {
	      if (d.difficulty=="RED"&&this.stress>0) return true;
	      return b;
	  }); 
      },
      unique:true
    },
    { name:"'Zeb' Orrelios",
      type:CREW,
      points:1,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  Unit.prototype.wrap_after("checkcollision",this,function(t,b) {
	      if (!self.unit.dead&&t==sh&&sh.isinfiringarc(t)) return false;
	      return b;
	  });
	  sh.wrap_after("checkcollision",this,function(t,b) {
	      if (!self.unit.dead&&sh.isinfiringarc(t)) return false;
	      return b;
	  });
      }
    },
    { name:"Ezra Bridger",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	      req:function(m,n) {
		  return self.isactive&&(sh.stress>0);
	      }.bind(this),
	      f:function(m,n) {
		  var f=FCH_focus(m);
		  if (f>0) {
		      this.unit.log("1 %FOCUS% -> 1 %CRIT% [%0]",this.name);
		      return m-FCH_FOCUS+FCH_CRIT;
		  }
		  return m;
	      }.bind(this),str:"focus"});
      },
    },
    { name:"Kanan Jarrus",
      type:CREW,
      points:3,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  this.rd=-1;
	  Unit.prototype.wrap_before("endmaneuver",self,function() {
	      var d=this.maneuverdifficulty;
	      if (!self.unit.dead&&d=="WHITE"&&this.stress>0&&self.rd<round
		  &&this.isally(self.unit)&&this.getrange(self.unit)<=2) {
		  this.log("-1 %STRESS% [%0]",self.name);
		  self.rd=round;
		  this.removestresstoken();
	      }
	  });
      }
    },
    { name:"Sabine Wren",
      type:CREW,
      points:2,
      upgrades:[BOMB],
      faction:REBEL,
      unique:true,
      done:true,
      rd:-1,
      init: function(sh) {
	  var self=this;
	  self.rd=-1;
	  Bomb.prototype.wrap_after("explode_base",this,function() {
	      var p=[self.unit];
	      if (self.rd==round||this.unit.isenemy(self.unit)) return;
	      for (var i in squadron) {
		  var u=squadron[i];
		  if (this.unit.isenemy(u)&&this.getrange(u)==1) p.push(u); 
	      }
	      this.unit.selectunit(p,function(p,k) {
		  if (k==0) return;
		  p[k].log("+1 %HIT% [%0]",self.name);
		  p[k].resolvehit(1);
		  self.rd=round;
		  SOUNDS.explode.play();
		  p[k].checkdead();
	      },["select unit (or self to cancel) [%0]",self.name],false);
	  });
      }
    },
    {
	name:"Ghost",
	type:TITLE,
	points:0,
	unique:true,
	done:true,
	getdeploymentmatrix:function(u) {
	    var gd=u.getdial();
	    var p=[];
	    for (var i=0; i<gd.length; i++) {
		var m0=this.unit.m.clone().translate(0,20).rotate(180,0,0);
		p.push(u.getpathmatrix(m0,gd[i].move));
	    }
	    return p;
	},
	init: function(sh) {
	    var phantom=-1;
	    var self=this;
	    for (var i in squadron) {
		var u=squadron[i];
		if (u.isally(sh)&&sh!=u) {
		    for (var j=0; j<u.upgrades.length; j++) {
			var upg=u.upgrades[j];
			if (upg.name=="Phantom") { phantom=i; break; }
		    }
		}
		if (phantom!=-1) break;
	    }
	    if (phantom!=-1) {
		var u=squadron[phantom];
		if (TEAMS[sh.team].isia==true) u=$.extend(u,IAUnit.prototype);
		u.dock(sh);
		sh.weapons[0].auxiliary=AUXILIARY,
		sh.weapons[0].subauxiliary=SUBAUXILIARY
		sh.weapons[0].type="Bilaser";
		sh.wrap_after("endmaneuver",this,function() {
		    if (this.docked) {
			u.donoaction([{org:self,type:"TITLE",name:self.name,action:function(n) {

			    this.weapons[0].auxiliary=undefined;
			    this.weapons[0].subauxiliary=undefined;
			    this.weapons[0].type="Laser";
			    u.deploy(this,self.getdeploymentmatrix(u));
			    u.endnoaction(n,"TITLE");
			}.bind(this)}],"",true);
		    }
		});
		
		sh.wrap_after("endcombatphase",this,function() {
		    if (this.docked) 
			for (var i=0; i<this.weapons.length; i++) {
			    var u=this.weapons[i];
			    if (u.type==TURRET&&u.isactive&&this.noattack<round) {
				this.log("+1 attack with %1 [%0]",self.name,u.name);
				// added attack
				this.noattack=round;
				this.selecttargetforattack(i);
				break;
			    }
			}	
		});
		sh.wrap_after("dies",this,function() {
		    if (this.docked) {
			this.docked.noattack=round;
			this.log("emergency deployment of %0, +1 %HIT% [%1]",this.docked.name,this.name);
			this.docked.resolvehit(1);
			this.docked.hasfired=0;
			this.docked.wrap_before("endphase",this.docked,function() {
			    this.hasmoved=false;
			});
			u.deploy(this,self.getdeploymentmatrix(u));
		    }
		});
	    } else sh.log("Phantom not found");
	},
	ship:"VCX-100"
    },
    {name:"Phantom",
     type:TITLE,
     points:0,
     unique:true,
     done:true,
     ship:"Attack Shuttle"
    },
    {name:"Reinforced Deflectors",
     points:3,
     type:SYSTEM,
     islarge:true,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.addafterdefenseeffect(self,function(c,h,t) {
	     if (c+h>=3) {
		 if (this.addshield(1)) this.log("+1 %SHIELD% [%0]",self.name);
	     }
	 });
     }
    },
    {name:"Targeting Astromech",
     points:2,
     type:ASTROMECH,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("handledifficulty",this,function(d) {
	     if (d=="RED")
		 this.selectunit(this.gettargetableunits(3),function(p,k) {
		     this.addtarget(p[k]);
		 },["select target or self to cancel [%0]",self.name],true);
	 });
     },
    },
    {name:"TIE/x7",
     points:-2,
     type:TITLE,
     lostupgrades:[CANNON,MISSILE],
     ship:"TIE Defender",
     done:true,
     init: function(sh) {
	 var self=this;/* FAQ v4.3 */
	 sh.wrap_before("endmaneuver",this,function() {
	     if (this.getdial()[this.maneuver].move.match(/[345]/)&&this.ocollision.overlap==-1&&this.touching.length==0&&this.candoevade()) {
		 this.log("+1 %EVADE% [%0]",self.name);
		 this.doselection(function(n) { this.addevade(n); }.bind(this));
	     }
	 });
     }
    },
    {name:"TIE/D",
     points:0,
     type:TITLE,
     ship:"TIE Defender",
     done:true,
     init: function(sh) {
	 this.unit.tiedattack=-1;
	 for (var i in sh.weapons) {
	     var w=sh.weapons[i];
	     //if (w.type==CANNON&&w.points<=3) w.followupattack=function() { return 0; };
	 }
	 sh.addattack(function(c,h) {
	     var w1=this.weapons[this.activeweapon];
	     return (w1.type==CANNON&&w1.points<=3&&this.tiedattack<round);
	 },this,[sh.weapons[0]],function() {
	     this.tiedattack=round; // Once per round
	 });
     }
    },
    {name:"TIE Shuttle",
     points:0,
     done:true,
     type:TITLE,
     ship:"TIE Bomber",
     maxupg:4,
     lostupgrades:[TORPEDO,MISSILE,BOMB],
     upgrades:[CREW,CREW]
    },
    {name:"Guidance Chips",
     points:0,
     type:MOD,
     done:true,
     init: function(sh) {
	 var self=this;
	 for (i in sh.weapons) {
	     var t=FCH_HIT;
	     var w=sh.weapons[i];
	     var w0=sh.weapons[0];
	     if (w0.isprimary&&w0.getattack()>=3) t=FCH_CRIT;
	     if (w.type.match(/Torpedo|Missile/)) {
		 w.wrap_after("modifyattackroll",this,function(m,n,d,m2) {
		     if (FCH_blank(m2,n)>0) m2=m2+t;
		     else if (FCH_focus(m2)>0) m2=m2-FCH_FOCUS+t;
		     else if (FCH_crit(m2)>0) m2=m2-FCH_HIT+t;
		     return m2;
		 });
	     }
	 }
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req: function(m,n) {
		 var t=this.weapons[this.activeweapon].type;
		 if (t==TORPEDO||t==MISSILE) return true;
		 return false;
	     }.bind(sh),
	     f: function(m,n) {
		 var b=FCH_blank(m,n);
		 var f=FCH_focus(m);
		 var h=FCH_hit(m);
		 var to=FCH_HIT;
		 var s="%HIT%";
		 if (this.weapons[0].isactive&&this.weapons[0].getattack()>=3) {
		     to=FCH_CRIT;
		     s="%CRIT%";
		 }
	     	 if (b>0) { sh.log("+1 "+s+" [%0]",self.name); m+=to; }
		 else if (f>0) { sh.log("%FOCUS% -> "+s+" [%0]", self.name); m+=to-FCH_FOCUS;}
		 else if (h>0&&to==FCH_CRIT) { sh.log("%HIT% -> %CRIT% [%0]",self.name); m+=to-FCH_HIT; }
		 return m;
	     }.bind(sh),str:"target"
	 });
     }
    },
    {name:"TIE/v1",
     ship:"TIE Adv. Prototype",
     points:1,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("addtarget",this,function(t) {
	     if (self.isactive&&this.candoaction()&&this.candoevade()) {
		 this.log("free %EVADE% action [%0]",this.name);
		 this.doselection(function(n) { this.addevade(n); }.bind(this));
	     }
	 });
     },
     type:TITLE
    },
    {name:"Zuckuss",
     faction:SCUM,
     points:1,
     unique:true,
     done:true,
     type:CREW,
     init: function(sh) {/* FAQ v4.3 */ /* TODO: not clean */
	 var self=this;
	 /* TODO : not a modifier, but rerolls.  */
	 sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	     req: function(m,n) { return self.isactive&&sh.stress==0; },
	     f:function(m,n) {
		 var f=FE_focus(m);
		 if (f>0&&sh.stress==0) {
		     targetunit.log("Reroll %0 %FOCUS% [%1]",f,self.name);
		     sh.log("+%0 %STRESS% [%1]",f,self.name);
		     var roll=sh.rolldefensedie(f,self,"evade");
		     m-=FE_FOCUS*f;
		     for (var i=0; i<f; i++) {
			 sh.addstress();
			 if (roll[i]=="evade") m+=FE_EVADE;
			 if (roll[i]=="focus") m+=FE_FOCUS;
		     }
		 }
		 return m;
	     },str:"focus"});
	 sh.adddicemodifier(ATTACK_M,MOD_M,DEFENSE_M,this,{
	     req: function(m,n) { return self.isactive&&sh.stress==0; },
	     f:function(m,n) {
		 var f=FE_evade(m);
		 if (f>0&&sh.stress==0) {
		     targetunit.log("Reroll %0 %EVADE% [%1]",f,self.name);
		     sh.log("+%0 %STRESS% [%1]",f,self.name);
		     var roll=sh.rolldefensedie(f,self,"evade");
		     m-=FE_EVADE*f;
		     for (var i=0; i<f; i++) {
			 sh.addstress();
			 if (roll[i]=="evade") m+=FE_EVADE;
			 if (roll[i]=="focus") m+=FE_FOCUS;
		     }
		 }
		 return m;
	     },str:"evade"});
     },
    },
    {name:"4-LOM",
     faction:SCUM,
     points:1,
     unique:true,
     done:true,
     type:CREW,
     init: function(sh) {
	 var self=this;
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req: function() { return targetunit.canusefocus(); },
	     f: function(m,n) {
		 this.addiontoken();
		 if (targetunit.canusefocus()) {
		     targetunit.log("cannot use focus in this attack [%0]",self.name);
		     targetunit.wrap_after("canusefocus",this,function() {
			 return false;
		     }).unwrapper("afterdefenseeffect");
		 }
		 return m;
	     }.bind(sh),str:"focus"});
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req: function() { return targetunit.canuseevade(); },
	     f: function(m,n) {
		 this.addiontoken();
		 if (targetunit.canusefocus()) {
		     targetunit.log("cannot use evade in this attack [%0]",self.name);
		     targetunit.wrap_after("canuseevade",this,function() {
			 return false;
		     }).unwrapper("afterdefenseeffect");
		 }
		 return m;
	     }.bind(sh),str:"evade"});
     }
    },
    {name:"Mist Hunter",
     type:TITLE,
     points:0,
     addedaction:"Roll",
     done:true,
     ship:"G-1A Starfighter",
     unique:true,
     upgrades:[CANNON],
     install: function(sh) {
	 var j,tb;
	 sh.installed=true;
	 // Search for TB
	 for (tb=0; tb<UPGRADES.length; tb++) if (UPGRADES[tb].name=="Tractor Beam") break;
	 if (tb==UPGRADES.length) return;
	 for (j=0; j<sh.upgradetype.length; j++) {
	     if (sh.upgradetype[j]==UPGRADES[tb].type&&sh.upg[j]==-1) {
		 addupgrade(sh,tb,j,true); sh.log("%0 added [%1]",UPGRADES[tb].name,this.name); 
		 break; 
	     }
	 }
     },
    },
{ /* not used anymore */
	name:"Adaptability(+1)",
	type:ELITE,
	points:0,
	invisible:true,
    },
    { /* not used anymore */
	name:"Adaptability(-1)",
	type:ELITE,
	points:0,
	invisible:true,
    },
    { 
	name:"Dengar",
	unique:true,
	type:CREW,
	points:3,
	faction:SCUM,
	done:true,
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return (targetunit.unique==true)?2:1; },
		req:function(attacker,w,defender) {
		    return this.isactive;
		}.bind(this)
	    });
	}
    },
    {
	name:"'Gonk'",
	unique:true,
	type:CREW,
	points:2,
	faction:SCUM,
	shield:0,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    if (this.isactive) { 
		self.log("+1 %SHIELD% on %0 [%0]",this.name);
		this.shield++;
	    }
	    self.endaction(n,CREW);
	    return true;
	},
	candoaction2: function() { return this.isactive; },
	action2:function(n) {
	    var self=this.unit;
	    if (this.isactive&&this.shield>0&&this.unit.shield<this.unit.ship.shield) {
		if (self.shield<self.ship.shield) 
		    self.log("+1 %SHIELD% [%0]",this.name);
		self.addshield(1);
		this.shield--;
		self.show();
	    }
	    self.endaction(n,CREW);
	    return true;
	},
	done:true
    },
    {
	name:"Boba Fett",
	unique:true,
	type:CREW,
	points:1,
	faction:SCUM,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("hashit",this,function(t) {
		var bu=this;
		if (!self.isactive) return;
		t.wrap_after("deal",self,function(c,f,p) {
		    p.then(function(crit) {
			if (crit.face==FACEUP) {
			    var p=[];
			    for (i in t.upgrades) {
				var upg=t.upgrades[i];
				if (upg.type.match(/Missile|Torpedo|Crew|Bomb|Cannon|Turret|Astromech|System|Illicit|Salvaged|Tech|Elite/)) {
				    p.push(upg);
				}
			    }
			    t.log("select upgrade to desactivate [%0]",self.name);
			    bu.selectupgradetodesactivate(p,self);
			}
		    });
		    return p;
		}).unwrapper("afterdefenseeffect");
	    });
	}
    },
    {
	name:"R5-P8",
	unique:true,
	type:SALVAGED,
	points:3,
	done:true,
	r5p8:-1,
	init: function(sh) {
	    var self=this;
	    sh.addafterdefenseeffect(this,function(c,h,t) {
		if (self.r5p8==round) return;
		self.r5p8=round;
		this.donoaction([{name:this.name,org:this,type:"HIT",action:function(n) {
		    var roll=this.rollattackdie(1,self,"hit")[0];
		    this.log("roll 1 attack dice [%0]",self.name);
		    if (roll=="hit"||roll=="critical") { 
			t.log("+1 %HIT% [%1]",self.name)
			t.resolvehit(1); 
			t.checkdead(); 
		    }
		    if (roll=="critical") {
			this.log("+1 %HIT% [%1]",self.name)
			this.resolvehit(1);
			this.checkdead();
		    }
		    this.endnoaction(n,"");
		}.bind(this)}],"",true);

	    });
	}
    },
    {
	name:"Attanni Mindlink",
	type:ELITE,
	points:1,
	rating:2,
	done:true,
	faction:SCUM,
	init: function(sh) {
	    var self=this;
	    if (typeof Unit.prototype.getattanni=="undefined")
		Unit.prototype.getattanni=function() { return []; }
	    Unit.prototype.wrap_after("getattanni",this,function(p) {
		return p.concat(self.unit);
	    });
	    sh.wrap_after("addfocustoken",this,function() {
		if (this.dead||!self.isactive) return;
		var p=this.getattanni();
		for (var i in p) if (p[i]!=this&&p[i].isally(this)
				     &&p[i].focus==0) {
		    p[i].addfocustoken();
		    p[i].log("+1 %FOCUS% [%0]",self.name);
		}
	    });
	    sh.wrap_after("addstress",this,function() {
		if (this.dead||!self.isactive) return;
		var p=this.getattanni();
		for (var i in p) if (p[i]!=this&&p[i].isally(this)
				     &&p[i].stress==0) {
		    p[i].addstress();
		    p[i].log("+1 %STRESS% [%0]",self.name);
		}
	    });
	}
    },
    {
	name:"Rage",
	type:ELITE,
	round:-1,
	candoaction: function() { return this.isactive; },
	action: function(n) {
	    var self=this.unit;
	    if (this.isactive) {
		this.unit.log("+1 %FOCUS%, +2 %STRESS%, 3 rerolls [%0]",self.name);
		this.round=round;
		self.addfocustoken();
		self.addstress();
		self.addstress();
	    }
	    self.endaction(n,ELITE);
	    return true;
	},
	init: function(sh) {
	    sh.adddicemodifier(ATTACK_M,REROLL_M,ATTACK_M,this,{
		dice:["blank","focus"],
		n:function() { return 3; },
		req:function(attacker,w,defender) {
		    return this.isactive&&this.round==round;
		}.bind(this)
	    });
	},
	done:true,
 	points:1
    },
    {
	name:"Punishing One",
	type:TITLE,
	unique:true,
	points:12,
	done:true,
	ship:"JumpMaster 5000",
	install: function(sh) {
	    sh.installed=true;
	    sh.weapons[0].wrap_after("getattack",this,function(a) {
		return a+1;
	    });
	    sh.showstats();
	},
	uninstall: function(sh) {
	    if (typeof sh.weapons[0].getattack.unwrap=="function") 
		sh.weapons[0].getattack.unwrap(this);
	    sh.showstats();
	},
    },
    {name:"Long-Range Scanners",
     type:MOD,
     points:0,
     done:true,
     requiredupg:[TORPEDO,MISSILE],
     init: function(sh) {
	 sh.wrap_after("gettargetableunits",this,function(n,q) {
	     var p=[];
	     if (n<3) return p;
	     for (var i in squadron) {
		 if (squadron[i].isenemy(this)) {
		     var r=this.getrange(squadron[i]);
		     if (r>=3) p.push(squadron[i]);
		 }
	     }
	     return p;
	 });
     }
    },
    {name:"Electronic Baffle",
     type:SYSTEM,
     points:1,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("addstress",this,function() {
	     //this.log("adding eb action");
	     this.donoaction([{type:"SYSTEM",name:self.name,org:self,
			       action:function(n) {
				   this.removestresstoken();
				   this.log("-1 %STRESS%, +1 %HIT% [%0]",self.name);
				   this.resolvehit(1);
				   this.endnoaction(n,"SYSTEM");
			       }.bind(this)}],"Take 1 %HIT% instead of %STRESS% token",true);
	 });
	 sh.wrap_after("addiontoken",this,function() {
	     this.donoaction([{type:"SYSTEM",name:self.name,org:self,
			       action:function(n) {
				   this.removeiontoken();
				   this.log("-1 %ION%, +1 %HIT% [%0]",self.name);
				   this.resolvehit(1);
				   this.endnoaction(n,"SYSTEM");
			       }.bind(this)}],"Take 1 %HIT% instead of %ION% token",true);});
     }
    },
    {
	name:"Overclocked R4",
	type:SALVAGED,
	points:1,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("begincombatphase",self,function(l) {
		this.wrap_after("removefocustoken",self,function() {
		    this.donoaction([{type:"STRESS",name:self.name,org:self,
				      action:function(n) {
					  this.addstress();
					  this.addfocustoken();
					  this.endnoaction(n,"SALVAGED");
				      }.bind(this)}],
				    "Add %STRESS% for %FOCUS%",true);
		}).unwrapper("endcombatphase");
		return l;
	    });
	}
    },
    {
        name: "Thermal Detonators",
	done:true,
	img:"seismic.png",
	snd:"explode",
	width: 16,
	height:8,
	size:15,
	explode: function() {
	    if (phase==ACTIVATION_PHASE&&!this.exploded) {
		var r=this.getrangeallunits();
		for (var i=0; i<r[1].length; i++) {
		    var u=squadron[r[1][i].unit];
		    u.log("+1 %HIT%, +1 %STRESS% [%0]",this.name);
		    u.resolvehit(1);
		    u.addstress();
		    u.checkdead();
		}
		this.explode_base();
	    }
	},
        type: BOMB,
        points: 3,
    },
    {
        name: "Ion Projector",
	type:MOD,
        islarge:true,
	done:true,
        points: 2,
	init: function(sh) {
	    var upg=this;
	    sh.wrap_before("collidedby",this,function(t) {
		if (upg.isactive&&t.isenemy(this)) {
		    var roll=this.rollattackdie(1,upg,"hit")[0];
		    if (roll=="hit"||roll=="critical") {
			t.log("+%1 %ION% [%0]",upg.name,1) 
			t.addiontoken();
		    }
		} else t.log("no effect [%0]",upg.name);
	    });
	}
    },
    {
	name:"Adaptability",
	type:ELITE,
	rating:2,
	points:0,
	done:true,
	faceup:false,
	canswitch: function() {
	    return phase <=SETUP_PHASE;
	},
	switch: function() {
	    this.faceup=!this.faceup;
	    if (this.faceup) this.variant="+1"; 
	    else this.variant="-1";
	    this.unit.showskill();
	},
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("getskill",this,function(s) {
		return (self.faceup?s+1:s-1);
	    });
	    this.switch();
	    sh.showskill();
	},
    },
    {
	name:"Systems Officer",
	type:CREW,
	limited:true,
	faction:EMPIRE,
	done:true,
	points:2,
	init: function(sh) {
            sh.wrap_after("endmaneuver",this,function() {
		var d=this.getdial()[this.lastmaneuver].difficulty;
		var a=this.selectnearbyally(1);
		if (d=="GREEN"&&a.length>0){ 
		    this.selectunit(a,function(p,k) {
			p[k].selectunit(p[k].gettargetableunits(3),function(pp,kk) {
			    this.addtarget(pp[kk]);
			},["select target to lock"],false);
		    },["select unit for free %TARGET% (or self to cancel)"],true);
		}
	    });
	}
    },
    {
	name:"Special Ops Training",
	type:TITLE,
	faction:EMPIRE,
	ship:"TIE/SF Fighter",
	points:0,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.addattack(function(c,h) { return this.secondattack; },this,[sh.weapons[0]],function() {},function() {
		var p=this.weapons[0].getenemiesinrange();
		var q=[];
		// select only targets in auxiliary arc
		for (var i in p) {
		    if (!this.isinprimaryfiringarc(p[i])) {
			q.push(p[i]);
		    }
		}
		return q;
	    });	
	    
	    sh.wrap_after("preattackroll",this,function(w,t) {
		var wp=this.weapons[w];
		this.secondattack=false;
		if (wp.isprimary&&this.isinprimaryfiringarc(t)) {
		    var a1={org:self,name:self.name,type:"HIT",action:function(n) {
			this.log("+1 attack die");
			this.wrap_after("getattackstrength",this,function(i,sh,a){
			    return a+1;
			}).unwrapper("attackroll");
			this.endnoaction(n,"HIT");
		    }.bind(this)};
		    this.donoaction([a1],"Add 1 additional attack die or one auxiliary arc attack (by default)",true,function() {
			this.secondattack=true;
		    }.bind(this));
		}
	    });
	}
    },
    {
	name:"Sensor Cluster",
	type:TECH,
	points:2,
	done:true,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,MOD_M,DEFENSE_M,self,{
		req:function(m,n) {
		    return self.isactive&&this.canusefocus();
		}.bind(sh),
		aiactivate: function(m,n) { return FE_blank(m,n)>0&&FE_focus(m)==0;},
		f:function(m,n) {	
		    if (this.canusefocus()>0&&FE_blank(m,n)>0) {
			this.removefocustoken();
			this.log("1 blank -> 1 %EVADE% [%0]",self.name);
			m=m+FE_EVADE;
		    }
		    return m;
		}.bind(sh),str:"blank"});
	}
    },
    {
	name:"R3 Astromech",
	type:ASTROMECH,
	points:2,
	done:true,
	init: function(sh) {
	    var self=this;
	    var rd=-1;
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,self,{
		req:function(m,n) {
		    return FCH_focus(m)>0&&rd<round;
		}.bind(sh),
		aiactivate: function(m,n) { return false; },
		f:function(m,n) {	
		    if (FCH_focus(m,n)>0&&rd<round) {
			this.addevadetoken();
			this.log("1 %FOCUS% -> 1 blank, +1 %EVADE% [%0]",self.name);
			rd=round;
			m=m-FCH_FOCUS;
		    }
		    return m;
		}.bind(sh),str:"focus"});
	}
    },
    {
        name: "Vectored Thrusters",
	type:MOD,
	done:true,
	islarge:false,
	addedaction:"Roll",
        points: 2,
    },
    {
        name: "Tail Gunner",
	type:CREW,
	done:true,
	limited:true,
        points: 2,
	init: function(sh) {
	    var self=this;
	    sh.wrap_before("resolveattack",self,function(w,target) {
		var wp=this.weapons[w];
		if (wp.isprimary&&wp.getauxiliarysector(target)<=3&&wp.type=="Bilaser") {
		    target.log("-1 defense [%0]",this.name);
		    target.wrap_after("getagility",this,function(a) {
			if (a>0) return a-1; 
			return a;
		    }).unwrapper("afterdefenseeffect");
		    target.showstats();
		}
	    });
	}
    },
    {
	name:"Collision Detector",
	type:SYSTEM,
	done:true,
	points:0,
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("canmoveonobstacles",this,function(type,v) {
		if (type.match(/DECLOAK|ROLL|BOOST/)) return true;
		return v;
	    });
	    sh.wrap_after("canhavecriticalocollision",this,function() {
		this.log("ignoring collision with obstacle [%0]",self.name);
		return false;
	    });		  
	}
    },
    {
	name:"Alliance Overhaul",
	type:TITLE,
	done:true,
	points:0,
	ship:"ARC-170",
	init: function(sh) {
	    var self=this;
	    sh.wrap_after("getattackstrength",this,function(w,sh,a) {
		if (this.weapons[w].isprimary&&this.isinprimaryfiringarc(targetunit)) {
		    this.log("+1 attack die [%0]",self.name);
		    return a+1;
		}
		return a;
	    }.bind(sh));
	    sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return !this.isinprimaryfiringarc(targetunit); 
		}.bind(sh),
		aiactivate: function(m,n) {
		    return FCH_focus(m)>0;
		},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.log("1 %FOCUS% ->1 %CRIT%");
			return m-FCH_FOCUS+FCH_CRIT;
		    }
		    return m;
		}.bind(sh),str:"focus"
	    });
	}
    },
    { /* TODO: Timing step ? */
	name:"Concord Dawn Protector",
	type:TITLE,
	done:true,
	points:1,
	ship:"Protectorate Starfighter",
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(DEFENSE_M,ADD_M,DEFENSE_M,this,{
		req:function(m,n) { 
		    return activeunit.isinfiringarc(this)&&this.isinfiringarc(activeunit)&&activeunit.getrange(this)==1; 
		}.bind(sh),
		aiactivate: function(m,n) { return true; },
		f:function(m,n) { 
		    this.log("+1 %EVADE% [%0]",self.name);
		    return {m:m+FE_EVADE,n:n+1}
		}.bind(sh),str:"evade"
	    });
	}
    },
    { /* TODO: Timing step ? */
	name:"Fearlessness",
	type:ELITE,
	rating:2,
	done:true,
	points:1,
	faction:SCUM,
	init: function(sh) {
	    var self=this;
	    sh.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
		req:function(m,n) { 
		    return targetunit.isinfiringarc(this)&&this.isinfiringarc(targetunit)&&targetunit.getrange(this)==1; 
		}.bind(sh),
		aiactivate: function(m,n) { return true; },
		f:function(m,n) { 
		    this.log("+1 %HIT% [%0]",self.name);
		    return {m:m+FCH_HIT,n:n+1}
		}.bind(sh),str:"hit"
	    });
	}
    },
    { name:"Seismic Torpedo",
      type:TORPEDO,
      points:2,
      done:true,
      firesnd:"missile",
      isWeapon: function() { return false; },
      candoaction: function() { return this.isactive; },
      action: function(n) {
	  var self=this.unit;
	  var p=self.selectnearbyobstacle(2);
	  if (p.length>0&&this.isactive) 
	      self.resolveactionselection(p,function(k) {
		  p[k].type=NONE;
		  p[k].g.attr({display:"none"});
		  SOUNDS.explode.play();
		  for (var i in squadron) {
		      var u=squadron[i];
		      if (u.getdist(u.m,p[k])<=10000) {
			  var roll=u.rollattackdie(1,self,"critical")[0];
			  if (roll=="hit") {
			      u.log("+1 %HIT% [%0]",this.name)
			      u.resolvehit(1); 
			      u.checkdead();
			  } else if (roll=="critical") {
			      u.log("+1 %CRIT% [%0]",this.name)
			      u.resolvecritical(1);
			      u.checkdead();
			  }
		      }
		  }
		  this.desactivate();
		  self.endaction(n,TORPEDO);
	      }.bind(this));
	  else self.endaction(n,TORPEDO);
      }
    },
    { name:"Latts Razzi",
      type:CREW,
      faction:SCUM,
      points:2,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.adddicemodifier(DEFENSE_M,ADD_M,DEFENSE_M,this,{
		req:function(m,n) {
		    return (activeunit.stress>0);
		}.bind(this),
		aiactivate: function(m,n) { return activeunit.stress>0;},
		f:function(m,n) {
		    if (activeunit.stress>0) {
			activeunit.log("-1 stress for %0, +1 %EVADE [%1]",activeunit.name,self.name);
			activeunit.removestresstoken();
			return {m:m+FE_EVADE, n:n+1};
		    } else return {m:m,n:n};
		}.bind(this),str:"evade"});
      }
    },
    { name:"Ketsu Onyo",
      type:CREW,
      faction:SCUM,
      points:1,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_before("endphase",this,function() {
	      var p=this.selectnearbyenemy(2,function(s,t) {
		  return s.tractorbeam>0;
	      });
	      if (p.length>0)
		  this.selectunit(p,function(p,k) {
		      p[k].wrap_after("resettractorbeam",self,function(a) {
			  return this.tractorbeam;
		      }).unwrapper("beginplanningphase");
		      p[k].log("keeps %0 tractor beam tokens [%1]",this.tractorbeam,self.name);
		   },["select unit"],true);
	   });
        }
    },
    { name:"IG-88D",
      type:CREW,
      faction:SCUM,
      points:1,
      unique:true,
      done:true,
      init: function(sh) {
	  for (var i in squadron) {
	      var u=squadron[i];
	      if (u!=sh&&u.ig2000==true&&u.isally(sh)) {
		  sh.log("copying %0 abilities [%1]",u.name,this.name);
		  u.init.call(sh,u);
	      }
	  }
      }
    },
    { name:"Rigged Cargo Chute",
      type:ILLICIT,
      islarge:true,
      points:1,
      done:true,
      candoaction: function() { return this.isactive; },
      action: function(n) {
	  var self=this.unit;
	  var m=self.getpathmatrix(self.m.clone().rotate(180,0,0),"F1").translate(40,-20).split();
	  console.log(">>"+m.dx+" "+m.dy+" "+m.rotate);
	  var ob=new Rock(MAXROCKS+9,[m.dx,m.dy,m.rotate+90],self.team,OBSTACLES.length);
	  OBSTACLES.push(ob);
	  this.desactivate();
	  self.endaction(n,ILLICIT);
      }
    },
    { name:"Black Market Slicer Tools",
      type:ILLICIT,
      points:1,
      done:true,
      candoaction: function() { return this.isactive; },
      action: function(n) {
	  var self=this;
	  var p=self.unit.selectnearbyenemy(2,function(s,t) {
	      return t.stress>0;
	  });
	  if (p.length>0&&this.isactive) {
	      this.unit.selectunit(p,function(q,k) {
		  var roll=self.unit.rollattackdie(1,self,"blank")[0];
		  if (roll=="hit"||roll=="critical") { 
		      q[k].applydamage(1); 
		      q[k].removestresstoken();
		      q[k].checkdead(); 
		  }
	      },["select unit [%0]",self.name],false);
	  }
	  this.unit.endaction(n,ILLICIT);
      }
    },
    { name:"Gyroscopic Targeting",
      ship:"Lancer-class Pursuit Craft",
      type:MOD,
      points:2,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.gtmaneuver=-1;
	  sh.wrap_before("endmaneuver",this,function(d) {
	      var m=this.getmaneuver();
	      this.gtmaneuver=-1;
	      if (m.move.match(/\w+[345]/)) this.gtmaneuver=round;
	  });
	  sh.wrap_before("endcombatphase",this,function() {
	      if (this.gtmaneuver==round)
		  this.donoaction([{org:self,type:"MOD",name:self.name,action:function(n) {
		      this.log("Free moving arc rotation [%0]",self.name);
		      this.resolvearcrotate(n,true);
		    }.bind(this)}],"",true);
	  });
      }
    },
    { name:"Shadow Caster",
      ship:"Lancer-class Pursuit Craft",
      type:TITLE,
      points:3,
      done:true,
      unique:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("hashit",this,function(t,r) {
	      if (r&&this.weapons[0].getauxiliarysector(t)<=2) {
		  this.log("+1 tractor beam token [%0]",self.name);
		  t.addtractorbeam(this);
	      }
	      return r;
	   });
      }
    },
    { name:"Jyn Erso",
      faction:REBEL,
      points:2,
      unique:true,
      done:true,
      type:CREW,
      candoaction: function() {  
	  return this.isactive&&!this.unit.dead;
      },
      action: function(n) {
	  var self=this.unit;
	  var p=self.selectnearbyally(2);
	  var e=self.selectnearbyenemy(3,function(s,t) {
	      return s.isinfiringarc(t);
	  });
	  if (p.length>0&&e.length>0) {
	      self.resolveactionselection(p,function(k) {
		  var l=e.length;
		  if (l>3) l=3;
		  for (var i=0; i<l; i++) p[k].addfocustoken();
		  self.endaction(n,"CREW");
	      });
	  } else {
	      self.log("no effect [%0]",this.name);
	      self.endaction(n,"CREW");
	  }
      }
    },
    { name:"Unkar Plutt",
      faction:SCUM,
      points:1,
      type:CREW,
      done:true,
      unique:true,
      init: function(sh) {
	  var self=this;
	  sh.unkar=-1;
	  sh.wrap_after("getcollidingunits",this,function(m,c) {
	      if (c.length>0&&this.unkar<round) {
		  this.unkar=round;
		  this.donoaction([{org:self,type:"CREW",name:self.name,action:function(n) {
		      self.unit.log("+1 %HIT%, +1 free action [%0]",self.name);
		      this.resolvehit(1);
		      SOUNDS.explode.play();
		      this.checkdead();
		      this.doaction(this.getactionlist(),"");
		      this.endnoaction(n,"CREW");
		  }.bind(this)}],"",true);
	      }
	      return c;
	  });
      }
    },
    {name:"Sabine's Masterpiece",
     faction:REBEL,
     ship:"TIE Fighter",
     unique:true,
     done:true,
     type:TITLE,
     upgrades:[CREW,ILLICIT],
     points:1,
    },
    {name:"Millennium Falcon(HoR)",
     faction:REBEL,
     ambiguous:true,
     ship:"YT-1300",
     unique:true,
     done:true,
     type:TITLE,
     points:1,
     init: function(sh) {
	 var self=this;
         sh.wrap_after("getmaneuverlist",this,function(list) {
	     var p=list;
	     if (this.hasionizationeffect()) return p;
	     for (var i in list) {
		 if (i.match(/BR3|BL3/)) {
			this.log("perform half-turn after a bank [%0]",self.name);
			var m="K"+i;
			p[m]={move:i,difficulty:list[i].difficulty,halfturn:true};
		    }
	     }
	     return p;
	 });
	 sh.wrap_before("completemaneuver",this,function(dial,d,h) {
	     if (dial.match(/BR3|BL3/)&&h==true) this.addstress();
	 });
     }
    },
    {name:"Smuggling Compartment",
     ship:"YT-",
     type:MOD,
     limited:true,
     done:true,
     points:0,
     upgrades:[MOD,ILLICIT],
     maxupg:3,
    },
    {name:"Burnout Slam",
     islarge:true,
     done:true,
     type:ILLICIT,
     addedaction:"SLAM",
     points:1,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("resolveslam",this,function() {
	     if(self.isactive) {
		 var n=self.unit.shipactionList.indexOf("SLAM");
		 self.unit.shipactionList.splice(n,1);
		 self.desactivate();
	     }
	 }.bind(sh));
     }
    },
    {name:"Finn",
     faction:REBEL,
     points:5,
     unique:true,
     type:CREW,
     done:true,
     init: function(sh) {
	 sh.adddicemodifier(ATTACK_M,ADD_M,ATTACK_M,this,{
	     req:function(m,n) {
		 return this.isactive&&this.unit.isinfiringarc(targetunit);
	     }.bind(this),
	     f:function(m,n) {
		 this.unit.log("+1 blank [%0]",this.name);
		 return {m:m,n:n+1};
	     }.bind(this),str:"crew"});
	 sh.adddicemodifier(DEFENSE_M,ADD_M,DEFENSE_M,this,{
	     req:function(m,n) {
		 return this.isactive&&this.unit.isinfiringarc(activeunit);
	     }.bind(this),
	     f:function(m,n) {
		 this.unit.log("+1 blank [%0]",this.name);
		 return {m:m,n:n+1};
	     }.bind(this),str:"crew"});
     }
    },
    {name:"Rey",
     faction:REBEL,
     points:2,
     unique:true,
     type:CREW,
     done:true,
     init:function(sh) {
	 var self=this;
	 self.focus=0;
	 sh.wrap_before("endphase",this,function() {
	     this.log("+1 %FOCUS% on %0",self.name);
	     if (this.focus>0) {
		 self.focus++;
		 this.removefocustoken();
	     }
	 });
	 sh.wrap_before("begincombatphase",this,function() {
	     if (self.focus>0) 
	     this.donoaction([{org:self,type:"CREW",name:self.name,action:function(n) {
		 self.focus--;
		 self.unit.addfocustoken();
		 self.unit.endnoaction(n,"CREW");
	     }}],"",true);
	 });
     }
    },
    {name:"Black One",
     points:1,
     unique:true,
     done:true,
     ship:"T-70 X-Wing",
     type:TITLE,
     skillmin:7,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("endaction",this,function(n,s) {
	     if (s!="BOOST"&&s!="ROLL") return;
	     var p=this.selectnearbyally(1,function(s,t) {
		 for (var i=0; i<t.istargeted.length; i++) 
		     if (!t.istargeted[i].isally(t)) return true;
		 return false;
	     });
	     if (p.length>0) {
		 this.selectunit(p,function(q,k) {
		     for (var i=0; i<q[k].istargeted.length; i++) {
			 var u=q[k].istargeted[i];
			 if (!q[k].isally(u)) {
			     q[k].log("removing %TARGET% from %0 [%1]",u.name,self.name);
			     u.removetarget(q[k]);
			     break;
			 }
		     }
		 },["select unit (or self to cancel) [%0]",self.name],false);
	     }
	 });
     }
    },
    {name:"Primed Thrusters",
     points:1,
     done:true,
     islarge:false,
     type:TECH,
     init: function(sh) {
	 sh.wrap_after("isactiondone",this,function(a,b) {
	     if (this.stress>0&&a!="ROLL"&&a!="BOOST") return true;
	     if (this.stress>0&&a=="ROLL"&&b) this.log("can do %ROLL% [%0]");
	     if (this.stress>0&&a=="BOOST"&&b) this.log("can do %BOOST% [%0]");
	     return b;
	 });
	 sh.wrap_after("hasnostresseffect",this,function() {
	     return stress<3;
	 });
     }
    },
    {name:"Snap Shot",
     points:2,
     type:ELITE,
     done:true,
     init: function(sh) {
	 var self=this;
	 Unit.prototype.wrap_after("doendmaneuveraction",self,function() {
	     var wpl=[];
	     for (var i in self.unit.weapons)
		 if (self.unit.weapons[i].getrange(this)>0)
		     wpl.push(self.unit.weapons[i]);
	     
	     if (wpl.length>0) {
		 sh.doselection(function(n) {
		     self.unit.select();
		     self.unit.wrap_before("selecttargetforattack",self,function() {
			 self.unit.endnoaction(n,"ATTACK");
		     }).unwrapper("selecttargetforattack");
		     self.unit.wrap_after("getdicemodifiers",self,function() {
			 return [];
		     }).unwrapper("cleanupattack");
		     self.unit.wrap_before("cancelattack",self,function() {
			 self.unit.maxfired++;
			 $("#attackdial").hide();
			 self.unit.endnoaction(n,"ATTACK");
		     }).unwrapper("cleanupattack");
		     self.unit.doattack(wpl,[this]);
		 }.bind(this));
	     }
	 });
     }
    },
    {name:"M9-G8",
     type:ASTROMECH,
     points:3,
     unique:true,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("gettargetableunits",this,function(n,l) {
	     return this.selectnearbyunits(n);
	 });
	 Unit.prototype.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req:function() {
		 return self.isactive&&!self.unit.isally(this);
	     }, /*TODO= req as bind to this, done */
	     f:function(m,n) {
		 if (FCH_crit(m)>0) {
		     this.log("1 %CRIT% rerolled [%0]",this.name);
		     m=m-FCH_CRIT+activeunit.attackroll(1);
		 } else if (FCH_hit(m)>0) {
		     this.log("1 %HIT% rerolled [%0]",this.name);
		     m=m-FCH_HIT+activeunit.attackroll(1);
		 }
		 return m;
	     },str:"critical"});
	 Unit.prototype.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
	     req:function() {
		 return self.isactive&&self.unit.isally(this);
	     },
	     f:function(m,n) {
		 if (FCH_blank(m)>0) {
		     this.log("1 blank rerolled [%0]",this.name);
		     m=m+activeunit.attackroll(1);
		 } else if (FCH_focus(m)>0&&!this.canusefocus()) {
		     this.log("1 %FOCUS% rerolled [%0]",this.name);
		     m=m-FCH_FOCUS+activeunit.attackroll(1);
		 }
		 return m;
	     },str:"blank"});

     }
    },
    {name:"Pattern Analyzer",
     type:TECH,
     points:2
    },
    {name:"General Hux",
     type:CREW,
     faction:EMPIRE,
     points:5,
     unique:true,
     done:true,
     candoaction: function() { return true; },
     action: function(n) {
	 var self=this.unit;
	 var p = self.selectnearbyally(2);
	 if (p.length>0) {
	     if (p.length==1) {
		 var c=new Condition(p[0],self,"Fanatical Devotion");
		 p[0].addfocustoken();
		 self.endaction(n,CREW);
	     }else if (p.length>=2) {
		 p.push(self);
		 self.log("select up to 3 units (self to cancel) [%0]",self.name);
		 self.resolveactionselection(p,function(k) {
		     if (p[k]==this) this.endaction(n,CREW);
		     var c=new Condition(p[k],self,"Fanatical Devotion");
		     p[k].addfocustoken();
		     p.splice(k,1);
		     if (p.length>1) 
			 this.resolveactionselection(p,function(l) {
			     if (p[l]==this) this.endaction(n,CREW);
			     p[l].addfocustoken();
			     p.splice(l,1);
			     if (p.length>1) 
				 this.resolveactionselection(p,function(h) {
				     if (p[h]==this) this.endaction(n,CREW);
				     p[h].addfocustoken();
				     this.endaction(n,CREW);
				 }.bind(this));
			     else this.endaction(n,CREW);
			 }.bind(this))
		     else this.endaction(n,CREW);
		 }.bind(self));
	    } else self.endaction(n,CREW);
	     self.addstress();
	 } else self.endaction(n,CREW);
     },
    },
    {name:"Kylo Ren",
     type:CREW,
     faction:EMPIRE,
     points:3,
     unique:true,
     done:true,
     candoaction: function() { return this.unit.selectnearbyenemy(3).length>0; },
     action: function(n) {
	 var self=this.unit;
	 var p=self.selectnearbyenemy(3);
	 this.resolveactionselect(p,function(k) {
	     var c=new Condition(p[k],self,"I'll Show You The Dark Side");
	 }.bind(this));
     }
     
    },/*TODO: bug to correct */
    {name:"Operations Specialist",
     type:CREW,
     points:3,
     limited:true,
     done:true,
     init: function(sh) {
	 var self=this;
	 Unit.prototype.wrap_after("endattack",self,function(c,h,t) {
	     if (self.isactive&&this.isally(self.unit)&&this.getrange(self.unit)<=2&&c+h==0) {
		 var p=this.selectnearbyally(3);
		 if (p.length>0) {
		     console.log(self.name+" "+this.name);
		     this.doselection(function(n) {
			 this.resolveactionselect(p,function(k) {
			     p[k].addfocustoken();
			     this.endnoaction(n,"OP");
			 }.bind(this));
		     }.bind(this));
		 }
	     }
	 });
     }
    },
    { name:"Kylo Ren's Shuttle",
      type:TITLE,
      points:2,
      ship:"Upsilon-class Shuttle",
      unique:true,
      done:true,
      init: function(sh) {
	  sh.wrap_after("endcombatphase",this,function() {
	      var p=this.selectnearbyenemy(2,function(s,t) {
		  return t.stress==0;
	      });
	      if (p.length>0) {
		  var q=p[0].selectnearbyally(3,function(s,t) {
		      return t.getrange(sh)<=2&&t.stress==0;
		  });
		  if (q.length>0) {
		      p[0].doselection(function(n) {
			  this.resolveactionselect(p,function(k) {
			      p[k].addstress();
			      p[0].endnoaction(n,TITLE);
			  });
		      });
		  }
	      }
	  });
      }
    },
    { name:"Targeting Synchronizer",
      type:TECH,
      points:3,
      done:true,
      init: function(sh) {
	  var self=this;
	  /* Same as Shara Bey. */
	  Unit.prototype.wrap_after("canusetarget",self,function(sh,r) {
	      if (self.unit!=this&&self.unit.isally(this)) {
		  if (self.unit.getrange(this)<=2
		  &&self.unit.targeting.indexOf(sh)>-1) {
		  return true;/* TODO incorrect */
		  }
	      }
	      return r;
	  });
	  Unit.prototype.wrap_before("removetarget",self,function(t) {
	      if (self.unit!=this&&self.unit.isally(this)) {
		  if (self.unit.getrange(this)<=2
		      &&this.targeting.indexOf(t)==-1
		      &&self.unit.targeting.indexOf(t)>-1) {
		      self.unit.removetarget(t);
		  }
	      }
	  });
      }
    },
    { name:"Hyperwave Comm Scanner",
      type:TECH,
      done:true,
      points:1,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("endsetupphase",this,function() {
	      var p=this.selectnearbyunit(2);
	      if (!self.isactive) return;
	      for (var i in p) {
		  var u=p[i];
		  u.donoaction([{type:"FOCUS",name:self.name,org:self,
				 action:function(n) {
				     this.addfocustoken();
				     this.endnoaction(n,"TECH");
				 }.bind(u)},
				{type:"EVADE",name:self.name,org:self,
				 action:function(n) {
				     self.desactivate();
				     this.addevadetoken();
				     this.endnoaction(n,"TECH");
				 }.bind(u)}],
			       "+1 %EVADE% / %FOCUS%",
			       true);
	      }	      
	  });
      }
    },
    { name:"A Score To Settle",
      type:ELITE,
      points:0,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.ascoretosettle=self;
	  sh.wrap_after("endsetupphase",this,function() {
	      var p=[];
	      for (var i in squadron)
		  if (squadron[i].team!=this.team) p.push(squadron[i]);
	      if (p.length>0) {
		  this.log("select unit for condition [%0]",self.name);
		  //this.doselection(function(n) {
		      this.resolveactionselection(p,function(k) {
			  var c=new Condition(p[k],this,"A Debt To Pay");
			  //this.endnoaction(n,"CONDITION");
		      }.bind(this));
		  //}.bind(this));
		  this.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,self,{
		      req:function(m,n) {
			  if (typeof targetunit.adebttopay!="undefined")
			      return targetunit.adebttopay.isactive;
			  return false;
		      },
		      f:function(m,n) {
			  this.log("1 %FOCUS% -> 1 %CRIT% [%0]",self.name);
			  m = m - FCH_FOCUS + FCH_CRIT;
			  return m;
		      }.bind(this),str:"focus"});
	      }
	  });
      }
    },
    { name:"Cassian Andor",
      type:CREW,
      points:2,
      faction:REBEL,
      unique:true,
      init: function(sh) {
	  sh.wrap_after("endplanningphase",this,function() {
	      var p = this.selectnearbyenemy(2);
	      if (p>0) 
	      this.doselection(function(n) {
		  this.resolveactionselect(p,function(k) {
		      this.guessmove(p[k].maneuver);
		  }.bind(this));
	      }.bind(this));
	  });
      }
    },
    { name:"Captain Rex",
      type:CREW,
      points:2,
      faction:REBEL,
      unique:true,
      done:true,
      init: function(sh) {
	  var self=this;
	  sh.wrap_after("hashit",this,function(t,b) {
	      if (!b) {
		  this.log("+1 stress, +1 %FOCUS% [%0]",self.name);
		  this.addfocustoken();
	      }
	      return b;
	  });

      }
    },
    { name:"EMP Device",
      unique:true,
      type:ILLICIT,
      points:2,
      range:[1,1],
      done:true,
      isTurret:function() { return true; },
      issecondary:false,
      firesnd:"missile",
      isWeapon:function() { return true; },
      getenemiesinrange: function() {
	  return [this.unit];
      },
      declareattack: function(target) {
	  if (!this.isactive) return false;
	  var p=this.unit.selectnearbyunits(1,function(a,b) { return a!=b; });
	  for (i in p) {
	      p[i].addiontoken();
	      p[i].addiontoken();
	      p[i].log("+2 %ION% [%0]",this.name);
	  }
	  this.isactive=false;
	  this.unit.cancelattack();
	  return false;
      },
      init: function(sh) {
	  var self=this;
	  this.toString=Upgrade.prototype.toString;
      },
    },
    { name:"Captured TIE",
      unique:true,
      type:MOD,
      ship:"TIE Fighter",
      faction:REBEL,
      points:1,
      done:true,
      init: function(sh) {
	  var self=this;
	  var hasattacked=false;
	  sh.wrap_after("declareattack",function(t,b) {
	      if (b) hasattacked=true;
	      return b;
	  });
	  sh.wrap_after("isenemy",this,function(t,b) {
	      return b||(!hasattacked&&t.getskill()<this.getskill()&&self.isactive);
	  });
      }
    },/* A TESTER*/
    {name:"Spacetug Tractor Array",
     type:MOD,
     ship:"Quadjumper",
     points:2,
     done:true,
     candoaction: function()  { return this.isactive; },
     action: function(n) {
	 var self=this.unit;
	 var p=self.selectnearbyunits(1,function(s,t) { return s!=t&&s.isinfiringarc(t);});
	 if (p.length>0) {
	     self.resolveactionselection(p,function(k) {
		 p[k].addtractorbeam(this);
		 this.unit.endaction(n,"MOD");
	     });
	 } else self.endaction(n,"MOD");
     }
    },
    {name:"Scavenger Crane",
     type:ILLICIT,
     points:2,
     done:true,
     init: function(sh) {
	 var self=this;/* TODO: no choice */
	 Unit.prototype.wrap_before("dies",this,function() {
	     if (this!=sh&&self.isactive&&sh.getrange(this)<=2) {
		 for (var i in sh.upgrades) {
		     var u=sh.upgrades[i];
		     if ((u.type==TORPEDO||u.type==MISSILE
			  ||u.type==BOMB||u.type==CANNON
			  ||u.type==TURRET||u.type==MOD)
			 &&u.isactive==false) { this.log("%0 active again [%1]",u.name,self.name); u.isactive=true; break; }
		 }
		 var r=sh.rollattackdie(1);
		 if (r[0]=="blank") self.isactive=false;
	     }

	 });
     }
    },
    {name:"Inspiring Recruit",
     type:CREW,
     points:1,
     done:true,
     init: function(sh) {
	 var self=this;
	 Unit.prototype.wrap_after("removestresstoken",this,function() {
	     if (this.isally(sh)&&this.getrange(sh)<=2&&this.stress>0) {
		 this.log("-1 stress token [%0]",self.name);
		 this.removestresstoken.vanilla.call(this);
	     }
	 });
     }
    },
    {name:"Baze Malbus",
     type:CREW,
     points:3,
     unique:true,
     done:true,
     faction:REBEL,
     init: function(sh) {
	 var self=this;
	 sh.addattack(function(c,h) { 
	     return this.weapons[0].isactive&&c+h==0; 
	 },this,[sh.weapons[0]],function() {	
	     this.noattack=round; 
	 },function() { 
	     this.log("+1 attack [%0]",self.name);	     
	     return this.selectnearbyenemy(3,function(t,s) {
		 return s!=targetunit;
	     });
	 });
     }
    },
    {name:"Bodhi Rook",
     type:CREW,
     points:1,
     unique:true,
     faction:REBEL,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("gettargetableunits",this,function(r,nouse) {
	     var t=[];
	     for (var i in squadron) {
		 var u=squadron[i];
		 if (u.isally(this)) 
		     t=t.concat(Unit.prototype.gettargetableunits.vanilla.call(t,3));
	     }
	     return t;
	 });
     }
    },
    {name:"Pivot Wing",
     type:TITLE,
     points:0,
     ship:"U-Wing",
     canbeswitched:false,
     done:true,
     canswitch: function() {
	 return this.canbeswitched;
     },
     switch: function() {
	 var self=this;
	 var u=this.unit;
	 this.canbeswitched=false;
	 if (this.faceup) {
	     if (typeof u.getagility.unwrap!="undefined") u.getagility.unwrap(this);
	     u.wrap_after("getmaneuverlist",this,function(p) {
		 if (typeof p.F0!="undefined") p["F0r"]={move:p.F0.move,difficulty:p.F0.difficulty,halfturn:true};
		 return p;
	     });
	     this.variant="Landing";
	 } else {
	     if (typeof u.getmaneuverlist.unwrap!="undefined") u.getmaneuverlist.unwrap(this);
	     u.wrap_after("getagility",this,function(a) {
		 return a+1;
	     });
	     this.variant="Attack";
	 }
	 this.faceup=!this.faceup;    
     },
     init: function(sh) {
	 var self=this;
	 this.switch();
	 this.unit.wrap_before("endmaneuver",this,function() {
	     self.canbeswitched=true;
	 });
     }
    },
    {name:"Adaptive Ailerons",
     type:TITLE,
     points:0,
     ship:"TIE Striker",
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.adaptive=-1;
	 /* TODO: TOO LONG ! */
	 if (typeof sh.facultativeailerons=="undefined") 
	     sh.facultativeailerons=false;
	 /* TODO timing of bombing */
	 sh.wrap_before("beginactivation",this,function() {
	     var old=this.maneuver;
	     	var gd=this.getdial();
	     var p=[];
	     var q=[];
	     for (var i=0; i<gd.length; i++) 
		 if (gd[i].move.match(/F1|BL1|BR1/)) { 
		     p.push(this.getpathmatrix(this.m,gd[i].move));
		     q.push(i);
		 }
	     
	     if (this.adaptive<round) {
		 this.adaptive=round;
	     this.donoaction([{org:self,type:"TITLE",name:self.name,action:function(n) {
		 this.wrap_after("candoendmaneuveraction",this,function() {
		     return false;
		 }).unwrapper("cleanupmaneuver");
		 this.wrap_after("getdial",this,function(gd) {
		     var p=[];
		     for (var i=0; i<gd.length; i++) {
			 p[i]={move:gd[i].move,difficulty:"WHITE"};
		     }
		     return p;
		 }).unwrapper("endmaneuver");

		 this.wrap_before("cleanupmaneuver",self,function() {
		     this.maneuver=old;		 
		     this.cleanupmaneuver.unwrap(self);
		     this.endnoaction(n,"TITLE");

		     //this.doselection(function(nn) {
			 this.hasmoved=false;
		     this.newlock().done(function() {
			 this.newlock().done(nextactivation);
			 nextactivation();
		     }.bind(this));
		 });
		 this.resolveactionmove(p,function(t,k) {
		     this.maneuver=q[k];
		     this.resolvemaneuver();
		 }.bind(this),false,true);
	     }.bind(this)}],"",this.facultativeailerons);
	    }
	 });
     }
    },
    {name:"Swarm Leader",/* TODO: No choice ! */
     unique:true,
     points:3,
     type:ELITE,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("preattackroll",this,function(w,t) {
	     var p=this.selectnearbyally(3,function(me,s) {
		 if (s.canuseevade()&&s.isinfiringarc(t)) return true;
		 return false;
	     });
	     var bonus=0;
	     if (p.length>0) { bonus++; p[0].removeevadetoken();}
	     if (p.length>1) { bonus++; p[1].removeevadetoken();}
	     this.log("+%1 attack die [%0]",bonus,self.name);
	     this.wrap_after("getattackstrength",this,function(i,sh,a){
		 return a+bonus;
	     }).unwrapper("attackroll");
	 });
     }
    },
    {name:"Lightweight Frame",
     type:MOD,
     points:2,
     agilitymax:3,
     ship:"TIE",
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("predefenseroll",this,function(w,a) {
	     if (getattackdice()>getdefensedice()) {
		 this.log("+1 defense roll [%0]",self.name);
		 this.wrap_after("getagility",self,function(d) {
		     return d+1;
		 }).unwrapper("dodefenseroll");
	     }
	 });
     }
    },
   {name:"'Light Scyk' Interceptor",
    type:TITLE,
    points:-2,
    ship: "M3-A Interceptor",
    lostupgrades:[MOD],
    done:true,
    init: function(sh) {
	this.deal=function(crit,face) {
	    var dd=$.Deferred();
	    return dd.resolve({crit:crit,face:FACEUP});
	};
	var save=[];
	sh.installed=true;
	sh.wrap_after("getdial",this,function(gd) {
	    if (save.length==0) 
		for (var i=0; i<gd.length; i++) {
		    var move=gd[i].move;
		    var d=gd[i].difficulty;
		    if (move.match(/BL\d|BR\d/)) d="GREEN";
		    save[i]={move:move,difficulty:d};
		}
	    return save;
	});
    }
   },
    {name:"Hotshot Co-Pilot",
     type:CREW,
     points:4,
     done:true,
     init: function(sh) {
	 var self=this;
	 var removeall=function() {
	     if (this.canusefocus()) { 
		 this.log("- %0 %FOCUS% [%1]",this.focus,self.name); 
		 for (var i=0; i<this.focus; i++) 
		     this.removefocustoken();
	     }
	 }
	 sh.wrap_before("resolveattack",this,function(w,t) {
	     if (w==0) t.wrap_before("endmodifydefensestep",self,removeall);
	 });
	 sh.wrap_before("isattackedby",this,function(w,t) {
	     t.wrap_before("endmodifyattackstep",self,removeall);
	 });
     }
    },
    {name:"Trick Shot",
     type:ELITE,
     points:0,
     done:true,
     init: function(sh) {
	 var self=this;
	 sh.wrap_after("getattackstrength",this,function(i,t,a) {
	     var obstacledef=this.getobstructiondef(t);
	     if (obstacledef>0) {
		 this.log("obstructed attack => +1 die [%0]",self.name);
		 a=a+1;
	     }
	     return a;
	 });
     }
    },
    {name:"Bistan",
     type:CREW,
     points:2,
     unique:true,
     done:true,
     faction:REBEL,
     /* TODO :check that condition is dynamic, hit may appear after a modification */
      init:function(sh) {
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (sh.getrange(targetunit)<=2);
		}.bind(this),
		aiactivate: function(m,n) { return true;},
		f:function(m,n) {
		    var h=FCH_hit(m);
		    if (h>0) {
			this.unit.log("%HIT% -> %CRIT% [%0]",this.name);
			m=m+FCH_CRIT-FCH_HIT;
		    }
		    return m;
		}.bind(this),str:"hit"});
     }
    
    },
    {name:"Expertise",
     type:ELITE,
     rating:2,
     points:4,
     done:true,
     init:function(sh) {
	 sh.adddicemodifier(ATTACK_M,MOD_M,ATTACK_M,this,{
		req:function(m,n) {
		    return (sh.stress==0);
		}.bind(this),
		aiactivate: function(m,n) { return FCH_focus(m)>0;},
		f:function(m,n) {
		    var f=FCH_focus(m);
		    if (f>0) {
			this.unit.log("%FOCUS% -> %HIT% [%0]",this.name);
			m=m+FCH_focus(m)*(FCH_HIT-FCH_FOCUS);
		    }
		    return m;
		}.bind(this),str:"focus"});
     }
     },
    {name:"BoShek",
     type:CREW,
     points:2
    },
    {name:"Pulse Ray Shield",
     type:MOD,
     faction:"REBEL|SCUM",
     points:2,
     init: function(sh) {
	 var self=this;
	 sh.wrap_before("endphase",this,function() {
	     this.donoaction([{org:self,type:"SHIELD",name:self.name,action:function(n) {
		 self.unit.log("+1 %ION%, +1 %SHIELD% [%0]",self.name);
		 self.unit.addiontoken();
		 self.unit.addshield(1);
		 this.endnoaction(n,"SHIELD");
	     }.bind(this)}],"",true);
	 });
     }  
    },
    {name:"Arc Caster",
     type:CANNON,
     faction:"REBEL|SCUM",
     range:[1,1],
     attack:4,
     canbeswitched:function() { return false; },
     points:2
    }
];
var allunits=[];

function Team(team) {
    this.team=team;
    this.isdead=false;
    this.isia=false;
    this.initiative=false;
    this.units=[];
    this.conditions={};
    this.captain=null;
    this.faction="REBEL";
    this.allhits=this.allcrits=this.allevade=this.allred=this.allgreen=0;
}
Team.prototype = {
    setia: function() {
	for (var i in squadron) {
	    var u=squadron[i];
	    if (squadron[i].team==this.team) {
		for (var j in IAUnit.prototype) {
		    squadron[i][j]=IAUnit.prototype[j];
		}
		squadron[i].IAinit();
	    }
	}
	this.ia=true;
    },
    setplayer: function() {
	for (var i in squadron) {
	    var u=squadron[i];
	    if (squadron[i].team==this.team)
		for (var j in IAUnit.prototype) 
		    if (typeof Unit.prototype[j]!="undefined") squadron[i][j]=Unit.prototype[j];
	}
	this.ia=false;
    },
    setfaction: function(faction) {
	$(".listunits .generic").remove();
	this.faction=faction;
	$("#"+faction+"select").prop("checked",true);
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;	
    },
    changefaction: function(faction) {
	$("#rocks").hide();
	$("#debris").hide();
	$("#caroussel").show();
	if (this.faction!=faction) {
	    for (var i in generics) {
		if (generics[i].team==this.team) {
		    delete generics[i];
		}
	    }
	    $("#totalpts").html(0);
	    this.setfaction(faction);
	    displayfactionunits();
	}
    },
    setrocks:function(r) {
	if (typeof r=="undefined") this.rocks=[-1,-1,-1];
	else this.rocks=r;
    },
    displayrockdebris: function(i,w,h,s,g,viewport,pa) {
	var j=(i%MAXROCKS)+(i>=MAXROCKS?ROCKS.length:0);
	var bb=g[j].getBBox();
	var m1;
	if (i<MAXROCKS)
	    m1=MT(i*w/ROCKS.length+w/ROCKS.length/4,h/4-bb.height*s/2).scale(s,s);
	else m1=MT((i-MAXROCKS)*w/DEBRISCLOUD.length+w/DEBRISCLOUD.length/4,3*h/4-bb.height*s/2).scale(s,s);
	g[j].transform(m1);
	g[j].appendTo(viewport);
	g[j].hover(function()  {g[j].attr({strokeWidth:12});},
		   function()  {g[j].attr({strokeWidth:3});});
	g[j].click(function() { 
	    var n=this.rocks.indexOf(i);
	    if (n>-1) {
		this.rocks[n]=-1;
		g[j].attr("fill",pa);
	    } else { 
		if (this.rocks[0]==-1) this.rocks[0]=i;
		else if (this.rocks[1]==-1) this.rocks[1]=i;
		else if (this.rocks[2]==-1) this.rocks[2]=i;
		if (this.rocks[0]>-1&&this.rocks[1]>-1&&this.rocks[2]>-1) {
		    //var o=OBSTACLES[i+(this.team-1)*3];
		    //$("ASTEROID"+this.team).remove();
		    for (var k=0; k<3; k++) {
			var o=OBSTACLES[k+(this.team-1)*3];
			o.g.remove();
			OBSTACLES[k+(this.team-1)*3]=
			    new Rock(this.rocks[k],
				     [o.tx,o.ty,o.alpha],
				     this.team,k);
		    }
		}
		if (this.rocks.indexOf(i)>-1) g[j].attr("fill",halftone(this.color));
	    }
	}.bind(this));
    },
    selectrocks:function() {
	if (typeof this.rocks=="undefined") this.rocks=[-1,-1,-1];
	$(".aster").empty();
	var sa=Snap(".aster");
	var g=[];
	var viewport=sa.g();
	var maxw=0,maxh=0;
	var padebris = sa.image(DEBRISIMG,0,0,256,256).pattern(0,0,256,256);
	var parock = sa.image(ROCKIMG,0,0,256,256).pattern(0,0,256,256);
	for (var i=0; i<ROCKS.length+DEBRISCLOUD.length; i++) {
	    if (i<ROCKS.length) {
		g[i]=sa.path(ROCKS[i]).attr({strokeWidth:3});
		if (this.rocks.indexOf(i)>-1)
		    g[i].attr({fill:halftone(this.color),stroke:this.color});
		else g[i].attr({fill:parock,stroke:"#888"});
	    } else {
		g[i]=sa.path(DEBRISCLOUD[i-ROCKS.length]).attr({strokeWidth:3});
		if (this.rocks.indexOf(i)>-1)
		    g[i].attr({fill:halftone(this.color),stroke:this.color});
		else g[i].attr({fill:padebris,stroke:"#888"});
	    }
	    var bb=g[i].getBBox();
	    if (maxw<bb.width) maxw=bb.width;
	    if (maxh<bb.height) maxh=bb.height;
	}
	var h=$(".aster").height();
	var w=$(".aster").width();
	var s=h/2/maxh;
	if (w/maxw/ROCKS.length<s) s=w/maxw/ROCKS.length;

	for (var i=0; i<ROCKS.length; i++) {
	    this.displayrockdebris(i,w,h,s,g,viewport,parock);
	}
	for (var i=0; i<DEBRISCLOUD.length; i++) {
	    this.displayrockdebris(i+MAXROCKS,w,h,s,g,viewport,padebris);
	}
    },
    checkdead: function() {
	var i;
	var alldead=true;
	for (i=0; i<this.units.length; i++) 
	    if (!this.units[i].dead) { alldead=false; break; }
	this.isdead=alldead;
	return alldead;
    },
    toggleplayer: function(name) {
	this.isia=!this.isia;
    },
    updatepoints: function() {
	var tot=0;
	var score1=$("#listunits li").each(function() {
	    var s=0;
	    $(this).find(".pts").each(function() {
		s+=parseInt($(this).text());
	    });
	    $(this).find(".upts span:first-child").html(s);
	    tot+=s;
	});
	$(".upts span:nth-child(2)").html(tot);
    },
    addunit:function(n) {
	if (n==-1) {
	    log("unknown addunit pilot "+pilots[n]);
	}
	var u=new Unit(this.team,n);
	$("#listunits").append(""+u);
	this.updatepoints();
    },
    tosquadron:function(s) {
	var team=this.team;
	var sortable = [];
	var i,j;
	var sortable = this.sortedgenerics();
	var team1=0;
	var id=0;
	for (var i in generics) 
	    if (generics[i].team==1) team1++;
	this.captain=null;
	//log("found team1:"+team1);
	for (var i=0; i<sortable.length; i++) {
	    if (this.team==sortable[i].team) {
		sortable[i].id=id++;
		if (sortable[i].team==2) sortable[i].id+=team1;
		var u=sortable[i];
		/* Copy all functions for manual inheritance.  */
		for (var j in PILOTS[u.pilotid]) {
		    var p=PILOTS[u.pilotid];
		    if (typeof p[j]=="function") u[j]=p[j];
		}
		u.tosquadron(s);
		allunits.push(u);
		squadron.push(u);
		this.units.push(u);
	    }
	}	
	
/*	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		if (this.isia==true) {
		    squadron[i]=$.extend(u,IAUnit.prototype);
		}
	    }
	}
*/	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team&&typeof u.init=="function") u.init();
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		for (var j=0; j<u.upgrades.length; j++) {
		    var upg=u.upgrades[j];
		    //if (upg.id>=0) log("removing "+upg.name+"?"+u.installed+" "+(typeof upg.uninstall));
		    // Need to unwrap generic upgrades, installed when creating the squad
		    if (upg.id>=0&&typeof UPGRADES[upg.id].uninstall=="function")
			UPGRADES[upg.id].uninstall(u);
		    // Now install the upgrades added during the tosquadron call
		    if (typeof upg.install=="function") upg.install(u);
		}
	    }
	}
	for (i in squadron) {
	    u=squadron[i];
	    if (u.team==this.team) {
		for (var j=0; j<u.upgrades.length; j++) {
		    var upg=u.upgrades[j];
		    if (typeof upg.init=="function"&&!u.isdocked) upg.init(u);
		}
	    }
	}

	this.units.sort(function(a,b) {return b.getskill()-a.getskill();});
	this.history={title: {text: UI_translation["Damage taken per turn"]},
		      axisX:{  interval: 1,title: UI_translation["Turns"]},
		      axisY: {	title: UI_translation["Cumulated damage"]},
		      rawdata:[],
		      data: [{        
		    indexLabelFontColor: "darkSlateGray",
		    name: "views",
		    type: "area",
		    color: "rgba(200,10,10,0.8)",
		    markerSize:8,
		    dataPoints: []}]
	};
	return this.units;
    },
    endsetup: function() {
	var i,j;
	for (i=0; i<this.units.length; i++) this.units[i].g.undrag();
    },
    endselection:function(s) {
	var i;
	var team=this.team;
	this.name=$("#teamname"+this.team).val();
	if (this.name=="") this.name="Squad #"+team;
	
	$("#team"+team).empty();
	$("#importexport"+team).remove();
	sq=this.tosquadron(s);
	for (i=0; i<sq.length; i++) {
	    if (team==1) {
		if (sq[i].tx<=0||sq[i].ty<=0) {
		    sq[i].tx=80-(sq[i].islarge?20:0);
		    sq[i].ty=70+82*i;
		    sq[i].alpha=90;
		}
		$("#team1").append("<div id=\""+sq[i].id+"\" onclick='select($(this).attr(\"id\"))'>"+sq[i]+"</div>");
	    } else {
		if (sq[i].tx<=0||sq[i].ty<=0) {
		    sq[i].tx=820+(sq[i].islarge?20:0);
		    sq[i].ty=70+82*i;
		    sq[i].alpha=-90;
		}
		$("#team2").append("<div id=\""+sq[i].id+"\" onclick='select(\""+sq[i].id+"\")'>"+sq[i]+"</div>");
	    }
	    sq[i].m.translate(sq[i].tx,sq[i].ty).rotate(sq[i].alpha,0,0);
	    sq[i].show();
	}
	$("#team"+team).css("top",$("nav").height()+2);
	activeunit=sq[0];
    },
    sortedgenerics: function() {
	var sortable=[];
	for (var i in generics) 
	    if (generics[i].team==this.team) sortable.push(generics[i]);
	sortable.sort(function(a,b) {
	    if (typeof a.points=="undefined") log("undefined score");
	    if (a.points<b.points) return -1; 
	    if (a.points>b.points) return 1;
	    return (a.toJuggler(false)<b.toJuggler(false));
	});
	return sortable;
    },
    toASCII: function() {
	var s="";
	var sortable=this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) 
	    s+=sortable[i].toASCII()+";";
	return s;
    },
    toKey: function() {
	var s="";
	var p=[];
	for (var i in generics) {
	    if (generics[i].team==this.team) p.push(generics[i]);
	}
	p.sort(function(a,b) { return a.pilotid-b.pilotid; });
	for (var i=0; i<p.length; i++) 
	    s+=p[i].toKey()+";";
	//s+=p[0].toKey();
	return s;
    },
    toJSON:function() {
	var s={};
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	s.description="";
	s.faction=f[this.faction];
	s.name=this.name;
	var sq=[];
	var pts=0;
	var sortable=this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) {
	    var jp=sortable[i].toJSON();
	    pts+=jp.points;
	    sq.push(jp);
	}
	s.pilots=sq;
	s.points=pts;
	// update also the number of points
	this.points=pts;
	s.vendor={xwsbenchmark:{builder:"Squadron Benchmark",builder_url:"http://xws-bench.github.io/bench/"}};
	s.version="0.3.0";
	return s;
    },
    toJuggler:function(translated) {
	var s="";
	var f={REBEL:"rebels",SCUM:"scum",EMPIRE:"empire"};
	var sortable = this.sortedgenerics();
	for (var i=0; i<sortable.length; i++) 
	    s+=sortable[i].toJuggler(translated)+"\n";
	return s;
    },
    parseJuggler : function(str,translated) {
	var f,i,j,k;
	var pid=-1;
	var getf=function(f) {
	    if (f=="REBEL") return 1;
	    if (f=="SCUM") return 2;
	    return 4;
	};
	var f=7;
	if (str=="") return;
	var pilots=str.trim().split("\n");
	var del=[];
	for (i in generics) { 
	    if (generics[i].team==this.team) delete generics[i];
	}
	for (i=0; i<pilots.length; i++) {
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    var lf=0;
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var vat=translate(v);
		var pu="";
		if (PILOTS[j].ambiguous==true&&typeof PILOTS[j].edition!="undefined") pu="("+PILOTS[j].edition+")";
		vat+=pu; v+=pu;
		if (v.replace(/\'/g,"")==pstr[0]) lf=lf|getf(PILOTS[j].faction);
		if (vat.replace(/\'/g,"")==pstr[0]) lf=lf|getf(PILOTS[j].faction);
	    }
	    f=f&lf;
	}
	if ((f&1)==1) this.faction="REBEL"; else if ((f&2)==2) this.faction="SCUM"; else this.faction="EMPIRE";
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	for (i=0; i<pilots.length; i++) {
	    pid=-1;
	    var pstr=pilots[i].split(/\s+\+\s+/);
	    for (j=0;j<PILOTS.length; j++) {
		var v=PILOTS[j].name;
		var vat=v;
		var pu="";
		if (PILOTS[j].faction==this.faction) {
		    vat=translate(v);
		    if (PILOTS[j].ambiguous==true&&typeof PILOTS[j].edition!="undefined") pu="("+PILOTS[j].edition+")";
		    v+=pu;
		    vat+=pu;
		    if (v.replace(/\'/g,"")==pstr[0]) { pid=j; break; }
		    if (vat.replace(/\'/g,"")==pstr[0]) { pid=j; translated=true; break; }
		} 
	    }
	    if (pid==-1) {
		//if (translated==false) return this.parseJuggler(str,true);
		console.log("pid undefined:"+translated+"!!"+pstr[0]+"!!"+this.faction);
	    }
 	    if (pid==-1) {
		log("unknown Juggler pilot:"+pilots[i]+"/"+str);
	    }
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    for (j=0; j<10; j++) p.upg[j]=-1;
	    if (typeof p.pilotid=="undefined") {
		console.log(pid+" "+p.name+" "+p.pilotid);
	    }
	    var authupg=[MOD,TITLE].concat(PILOTS[p.pilotid].upgrades);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    if ((translated==true&&translate(UPGRADES[k].name).replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
			||(UPGRADES[k].name.replace(/\'/g,"")==pstr[j])) {
			if (authupg.indexOf(UPGRADES[k].type)>-1) {
			    if (typeof UPGRADES[k].upgrades!="undefined") 
				if (UPGRADES[k].upgrades[0]=="Cannon|Torpedo|Missile") {
				    authupg=authupg.concat([CANNON,TORPEDO,MISSILE]);
				    p.upgradetype=p.upgradetype.concat([CANNON,TORPEDO,MISSILE]);
				}
			    else { 
				authupg=authupg.concat(UPGRADES[k].upgrades);
				p.upgradetype=p.upgradetype.concat(UPGRADES[k].upgrades);
			    }
			    break;
			} 
		    }
		    if (k==UPGRADES.length) log("UPGRADE undefined: "+pstr[j]);
		}
	    }
	    //for (j=0; j<p.upgradetype.length; j++)
	    //	p.log("found type "+p.upgradetype[j]);
	    for (j=1; j<pstr.length; j++) {
		for (k=0; k<UPGRADES.length; k++) {
		    if ((translated==true&&translate(UPGRADES[k].name).replace(/\'/g,"").replace(/\(Crew\)/g,"")==pstr[j])
			||(UPGRADES[k].name.replace(/\'/g,"")==pstr[j])) {
			if (authupg.indexOf(UPGRADES[k].type)>-1) {
			    for (f=0; f<p.upgradetype.length; f++) {
				//log("check ?"+p.upgradetype[f]+" "+UPGRADES[k].type);
				if (p.upgradetype[f]==UPGRADES[k].type&&p.upg[f]==-1) { p.upg[f]=k; break; }
			    }
			    break;
			} else log("** "+pstr[j]+" UPGRADE not listed: "+UPGRADES[k].type+" in "+p.name);
		    }
		}
	    }
	}
	//nextphase();
	
    },
    parseASCII: function(str) {
	var pilots=str.split(";");
	for (var i in generics) if (generics[i].team==this.team) delete generics[i];
	for (var i=0; i<pilots.length-1; i++) {
	    var coord=pilots[i].split(":");
	    var updstr=coord[0].split(",");
	    var pid=parseInt(updstr[0],10);
	    this.faction=PILOTS[pid].faction;
	    this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	    if (pid==-1) {
		log("unknown ASCII pilot "+pilots[i]);
	    }
	    var p=new Unit(this.team,pid);
	    p.upg=[];
	    for (var j=0; j<10; j++) p.upg[j]=-1;
	    for (var j=1; j<updstr.length; j++) {
		var n=parseInt(updstr[j],10);
		for (var f=0; f<p.upgradetype.length; f++)
		    if (p.upgradetype[f]==UPGRADES[n].type&&p.upg[f]==-1) { p.upg[f]=n; break; }
	        //if (typeof UPGRADES[n].install!="undefined") UPGRADES[n].install(p);
	    }
	    if (coord.length>1) {
		var c=coord[1].split(",");
		p.tx=parseInt(c[0],10);
		p.ty=parseInt(c[1],10);
		p.alpha=parseInt(c[2],10);
	    }
	}
	//nextphase();
    },
    parseJSON:function(str,translated) {
	var s;
	var f={"rebel":REBEL,"scum":SCUM,"imperial":EMPIRE};
	try {
	    s=$.parseJSON(str);
	    ga('send','event', {
		eventCategory: 'social',
		eventAction: 'receive',
		eventLabel: 'xws'
	    });
	} catch(err) {
	    return this.parseJuggler(str,translated);
	}
	var i,j,k;
	this.name=s.name;
	this.points=s.points;
	this.faction=f[s.faction];
	this.color=(this.faction=="REBEL")?RED:(this.faction=="EMPIRE")?GREEN:YELLOW;
	for (i in generics) if (generics[i].team==this.team) delete generics[i];
	for (i=0; i<s.pilots.length; i++) {
	    var pilot=s.pilots[i];
	    var p;
	    var pid=-1;
	    pilot.team=this.team;
	    for (j=0; j<PILOTS.length; j++) {
		if (PILOTS[j].faction==this.faction&&
		   PILOTS[j].unit==PILOT_dict[pilot.ship]) {
		    va=PILOTS[j].name;
		    if (va==PILOT_dict[pilot.name]) { pid=j; break; }
		}
	    }
	    if (pid==-1) throw("pid undefined:"+PILOT_dict[pilot.name]);

	    p=new Unit(this.team,pid);
	    p.upg=[];
	    for (var j=0; j<10; j++) p.upg[j]=-1;

	    if (typeof pilot.upgrades!="undefined")  {
		var nupg=0;
		for (j in pilot.upgrades) { 
		    var upg=pilot.upgrades[j];
		    for (k=0; k<upg.length; k++) {
			nupg++;
			for (var z=0; z<UPGRADES.length; z++) 
			    if (UPGRADES[z].name==UPGRADE_dict[upg[k]]) {
				for (var f=0; f<p.upgradetype.length; f++)
				    if (p.upgradetype[f]==UPGRADES[z].type&&p.upg[f]==-1) { p.upg[f]=z; break; }
				//if (typeof UPGRADES[z].install != "undefined") UPGRADES[z].install(p);
				break;
			    }
		    }
		}
	    }
	}
	//nextphase();
    }
}
var a1 = [];
a1[0]=2/8; // blank
a1[1]=3/8; // hit
a1[10]=1/8; // crit
a1[100]=2/8; // focus
var d1 = [];
d1[0]=3/8; // blank
d1[1]=3/8; // evade
d1[10]=2/8; // focus

// Add one dice to already existing roll of n dices
function addattackdice(n,proba) {
    var f,c,h,i;
    var p=[];
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++)
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
		p[i+1]=0;
		p[i+10]=0;
		p[i+100]=0;
	    }
    for (f=0; f<n; f++) 
	for (h=0; h<n-f; h++) 
	    for (c=0; c<n-h-f; c++) {
		i=100*f+h+10*c;
		p[i]+=proba[i]*a1[0];
		p[i+1]+=proba[i]*a1[1];
		p[i+10]+=proba[i]*a1[10];
		p[i+100]+=proba[i]*a1[100];
	    }
    return p;
}
function adddefensedice(n,proba) {
    var f,e,i;
    var p=[];
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]=0;
	    p[i+1]=0;
	    p[i+10]=0;	   
	}
    }
    for (f=0; f<n; f++) {
	for (e=0; e<n-f; e++) {
	    i=10*f+e;
	    p[i]+=proba[i]*d1[0];
	    p[i+1]+=proba[i]*d1[1];
	    p[i+10]+=proba[i]*d1[10];
	}
    }
    return p;
}

function attackproba(n) {
    var i;
    var proba=[];
    proba[0]=a1[0];
    proba[1]=a1[1];
    proba[10]=a1[10];
    proba[100]=a1[100];
    for (i=2; i<=n; i++) {
	proba=addattackdice(i,proba);
    }

    return proba;
}
function defenseproba(n) {
    var i;
    var proba=[];
    proba[0]=d1[0];
    proba[1]=d1[1];
    proba[10]=d1[10];
    for (i=2; i<=n; i++) {
	proba=adddefensedice(i,proba);
    }
    return proba;
}
function attackwithreroll(tokensA,at,attack) {
    var f,h,c,f2,h2,c2,i,j,b;
    var p=[];
    if (tokensA.reroll==0) return at;
    if (typeof tokensA.reroll=="undefined") return at;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++)
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		p[i]=0;
	    }
    var newf=0, r;
    for (f=0; f<=attack; f++) 
	for (h=0; h<=attack-f; h++) 
	    for (c=0; c<=attack-h-f; c++) {
		i=100*f+h+10*c;
		b=attack-h-c-f; // blanks
		r=tokensA.reroll;
		newf=f;
		if (tokensA.reroll>b) { // more reroll than blanks
		    if (tokensA.focus==0) {
			if (tokensA.reroll>f+b) { // more rerolls than blanks+focus
			    r=f+b;
			    newf=0; // no more focus in results
			} else newf=f-(r-b);
		    } else r=b;
		} 
		//log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
		if (r==0) p[i]+=at[i];
		else {
		    var tot=0;
		    for (f2=0; f2<=r; f2++) 
			for (h2=0; h2<=r-f2; h2++)
			    for (c2=0; c2<=r-f2-h2; c2++) {
				j=100*f2+h2+10*c2;
				k=100*(newf+f2)+h+h2+10*(c+c2);
				p[k]+=at[i]*ATTACK[r][j];
//				if (tokensA.reroll>0) log(attack+" at["+f+" "+h+" "+c+"]:"+at[i]+"*A["+r+"]["+f2+" "+h2+" "+c2+"]:"+ATTACK[r][j]);
			    }
		}
	    }
    return p;
}
function defendwithreroll(tokensD,dt,defense) {
    var f,e,f2,e2,i,j,b;
    var p=[];
    if (tokensD.reroll==0) return dt;
    if (typeof tokensD.reroll=="undefined") return dt;
    //log("THERE IS REROLL:"+tokensA.reroll);
    for (f=0; f<=defense; f++) for (e=0; e<=defense-f; e++) p[10*f+e]=0;
    var newf=0, r;
    for (f=0; f<=defense; f++) 
	for (e=0; e<=defense-f; e++) {
	    i=10*f+e;
	    b=defense-e-f; // blanks
	    r=tokensD.reroll;
	    newf=f;
	    if (tokensD.reroll>b) { // more reroll than blanks
		if (tokensD.focus==0) {
		    if (tokensD.reroll>f+b) { // more rerolls than blanks+focus
			r=f+b;
			newf=0; // no more focus in results
		    } else newf=f-(r-b);
		} else r=b;
	    } 
	    //log(tokensA.reroll+">>["+f+" "+h+" "+c+"] f"+newf+" r"+r);
	    if (r==0) p[i]+=dt[i];
	    else {
		for (f2=0; f2<=r; f2++) 
		    for (e2=0; e2<=r-f2; e2++) {
			j=10*f2+e2;
			k=10*(newf+f2)+e+e2;
			p[k]+=dt[i]*DEFENSE[r][j];
		    }
	    }
	}
    return p;
}

function tohitproba(attacker,weapon,defender,at,dt,attack,defense) {
    var p=[];
    var k=[];
    var f,h,c,d,fd,e,i,j,hit,evade;
    var missed=0;
    var tot=0,mean=0,meanc=0;
    var ATable=at;
    var DTable=dt;
    var rr=attacker.reroll;
    var dt=(defense==0)?[]:dt;
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=h+10*c;
	    p[i]=0;
	}
    }
    
    if (typeof ATable=="undefined") return {proba:[],tohit:0,meanhit:0,meancritical:0,tokill:0};
    ATable=attackwithreroll(attacker,at,attack);
    //log("Attack "+attack+" Defense "+defense);
    if (defense>0) DTable=defendwithreroll(defender,dt,defense);
    //for (j=0; j<=20; j++) { k[j]=0; }
    for (f=0; f<=attack; f++) {
	for (h=0; h<=attack-f; h++) {
	    for (c=0; c<=attack-h-f; c++) {
		var n=FCH_FOCUS*f+FCH_CRIT*c+FCH_HIT*h;
		var fa,ca,ha,ff,ef;
		var focusa=attacker.focus;
		var savedreroll=attacker.reroll;

		var a=ATable[FCH_FOCUS*f+FCH_HIT*h+FCH_CRIT*c]; // attack index
		if (typeof weapon.modifyattackroll!="undefined") n=weapon.modifyattackroll(n,attack,defender);
		if (typeof attacker.modifyattackroll!="undefined") n=attacker.modifyattackroll(n,attack,defender);
		fa=FCH_focus(n);
		ca=FCH_crit(n);
		hit=FCH_hit(n);
		if (attacker.focus>0&&fa>0) { hit+=fa;attacker.focus--; }

		for (ff=0; ff<=defense; ff++) {
		    for (ef=0; ef<=defense-ff; ef++) {
			var fd;
			var focusd=defender.focus;
			var evade=defender.evade;
			var savedevade=defender.evade;
			var savedfocus=defender.focus;
			var m=FE_FOCUS*ff+FE_EVADE*ef
			if (typeof defender.modifydefenseroll!="undefined") 
			    m=defender.modifydefenseroll(attacker,m,defense);
			fd=FE_focus(m)
			evade=FE_evade(m);
			if (defense==0) d=1; else d=DTable[m]
			i=0;
			if (defender.focus>0&&fd>0&&evade<hit+ca) { evade+=fd;defender.focus--; }
			if (defender.evade>0&&evade<hit+ca) { evade+=1;defender.evade--; }
			if (hit>evade) { i = FCH_HIT*(hit-evade); evade=0; } 
			else { evade=evade-hit; }
			if (ca>evade) { i+= FCH_CRIT*(ca-evade); }
			if (typeof weapon.modifyhit=="function"&&i>0) i=weapon.modifyhit(i);
			attacker.reroll=0;
			/*if (typeof attacker.postattack=="function") {
			    attacker.postattack(i);
			}*/
			
			if (typeof weapon.immediateattack!="undefined"
			    &&weapon.immediateattack.pred(i)
			    &&typeof attacker.iar=="undefined") {
			    attacker.iar=true;
			    var w=weapon.immediateattack.weapon();
			    var r=attacker.gethitrange(w,defender);
			    // No prerequisite checked.
			    if (r<=3&&r>0) {
				//console.log("immediate attack:"+weapon.name+"->"+attacker.weapons[w].name+" "+attacker.reroll+" "+attacker.name)
				var attack2=attacker.getattackstrength(w,defender);
				var defense2=defender.getdefensestrength(w,attacker);
				var thp= tohitproba(attacker,attacker.weapons[w],defender,
						    attacker.getattacktable(attack2),
						    defender.getdefensetable(defense2),
						    attack2,
						    defense2);
				//console.log(attacker.name+" after call "+n+"/"+m+" ("+attack2+"/"+defense2+"/"+attacker.weapons[w].name+"):"+p[0]+" + "+thp.proba[0]+" * "+(a*d));
				for (var j in thp.proba) {
				    var k=i+j*1;
				    if (typeof p[k]=="undefined") p[k]=0;
				    p[k]+=thp.proba[j]*a*d;
				}
			    } else p[i]+=a*d;
			    delete attacker.iar;
			} else {
			    p[i]+=a*d;
			}
			defender.focus=savedfocus;
			defender.evade=savedevade;
		    }
		}
		attacker.focus=focusa;
		attacker.reroll=savedreroll;
	    }
	}
    }
    //console.log("missed "+missed+"/"+p[0]+" "+attacker.name+" "+weapon.iar);
    for (h=0; h<=attack; h++) {
	for (c=0; c<=attack-h; c++) {
	    i=FCH_HIT*h+FCH_CRIT*c;
	    if (i>0) tot+=p[i];
	    mean+=h*p[i];
	    meanc+=c*p[i];
	    // Max 3 criticals leading to 2 damages each...Proba too low anyway after that.
	    /*switch(c) {
	    case 0:
		for(j=1; j<=c+h; j++) k[j]+=p[i];
		break;
	    case 1:
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33;
		for(j=2; j<=c+h+1; j++) k[j]+=p[i]*7/33;
		break;
	    default: 
		for(j=1; j<=c+h; j++) k[j]+=p[i]*(33-7)/33*(32-7)/32;
		for (j=2; j<=c+h+1; j++) k[j]+=p[i]*(7/33*(1-6/32)+(1-7/33)*7/32);
		for (j=3; j<=c+h+2; j++) k[j]+=p[i]*7/33*6/32;
	    }*/
	}
    }
    //log("proba "+attacker.name+" "+attacker.iar+" "+tot);
    return {proba:p, tohit:Math.floor(tot*10000)/100, meanhit:tot==0?0:Math.floor(mean * 100) / 100,
	    meancritical:tot==0?0:Math.floor(meanc*100)/100}; //,tokill:k} ;
}
var cmd=[];
var startreplayall=function() {
    if (REPLAY.length==0) return;
    try {
	FAST= (REPLAY.substr(-1)!="W")&&(window.self == window.top);
	if (window.self != window.top) console.log("REPLAY in FRAME: "+FAST);
    } catch(e) { FAST=false; }
    ANIM=REPLAY;
    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(window.location.search.substr(1)));
    var args=arg.split("&");
    cmd=args[6].split("_");
    cmd.splice(0,1);
    if (cmd.length==0) return;
    $(".nextphase").prop("disabled",true);
    $(".unit").css("cursor","pointer");
    actionrlock=$.Deferred();
    actionrlock.progress(replayall);
    //for (var j in squadron) console.log("squadron["+j+"]:"+squadron[j].name+" "+squadron[j].id);
    if (TEAMS[1].isia==true) TEAMS[1].setia();
    if (TEAMS[2].isia==true) TEAMS[2].setia();
    //endsetupphase();
    subphase=ACTIVATION_PHASE;
    for (i in squadron) {
	squadron[i].hasmoved=false; 
	squadron[i].maneuver=-1;
	squadron[i].hasdecloaked=false;
    }
    replayall();
}
var stopreplay=function() {
    actionrlock=$.Deferred();
}
var restartreplay=function() {
    ga('send','event', {
	eventCategory: 'interaction',
	eventAction: 'replay',
	eventLabel: 'replay'
    });
    actionrlock=$.Deferred();
    actionrlock.progress(replayall);
    replayall();
}
var replayall=function() {
    //log("replay all "+cmd+" "+phase+" "+round);
    if (cmd=="") {
	FAST=false;
	filltabskill();
	//log("setting phase"+phase);
	if (phase!=SETUP_PHASE) setphase();
	else {
	    $(".imagebg").hide();
	    $(".nextphase").prop("disabled",false);
	    for (var i=0; i<OBSTACLES.length; i++) OBSTACLES[i].addDrag();
	    if (TEAMS[1].isia==true) TEAMS[1].setplayer();
	    if (TEAMS[2].isia==true) TEAMS[2].setplayer();
	    displayplayertype(1);
	    displayplayertype(2);
	}
	INREPLAY=false;
	return;
    }

    INREPLAY=true;
    var c=cmd[0].split("-");
    console.log(cmd[0]);

    cmd.splice(0,1);
    var u=null;
    var j;
    //endsetupphase();
    if (c[0].length>0) {
	var id=parseInt(c[0],10);
	for (j in squadron) if (squadron[j].id==id) break; 
	if (squadron[j].id==id) u=squadron[j];
	else {
	    console.log("cannot find id "+id);
	    //for (j in squadron) console.log("squadron["+j+"]="+squadron[j].name);
	    actionrlock.notify();
	    return;
	}
    } 
    //if (u!=null) log("cmd : "+u.name+" "+c[1]);
    var FTABLE={"fo":"removefocustoken",
		"FO":"addfocustoken",
		"e":"removeevadetoken",
		"E":"addevadetoken",
		"ct":"removecloaktoken",
		"CT":"addcloaktoken",
		"i":"removeiontoken",
		"I":"addiontoken",
		"tb":"removetractorbeamtoken",
		"TB":"addtractorbeamtoken",
		"ST":"addstress",
		"DPY":"deploy",
		"st":"removestresstoken",
		"d":"dies",
	   };
    if (typeof FTABLE[c[1]]=="string") {
	var f=Unit.prototype[FTABLE[c[1]]];
	//if (typeof f=="undefined") console.log("ftable "+c[1]+" "+FTABLE[c[1]]);
	if (typeof f.vanilla=="function") { f.vanilla.call(u,t); }
	else {  f.call(u);}
	actionrlock.notify();
	return;
    }
    switch(c[1]) {
    case "W":/* do nothing */ break;
    case "P": 
	var p=phase;
	r=parseInt(c[2],10);
	phase=parseInt(c[3],10);
	if (round!=r) {
	    $("#turnselector").append("<option value='"+round+"'>"+UI_translation["turn #"]+round+"</option>");
	    round=r;
	    for (var i in squadron) {
		var u=squadron[i];
		u.focus=Unit.prototype.resetfocus.call(u);
		u.evade=Unit.prototype.resetevade.call(u);
		u.tractorbeam=Unit.prototype.resettractorbeam.call(u);
		u.showinfo();
	    }
	}
	if (phase==SETUP_PHASE+1&&r==1) endsetupphase();
	$("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
	actionrlock.notify();
	break;
    case "L":	
	if (!FAST) {
	    var i=(decodeURIComponent(c[2].substring(2,c[2].length-2)));
	    u.setinfo(i).delay(1500).fadeOut(400);
	    setTimeout(function() { actionrlock.notify();},2000);
	} else actionrlock.notify();
	break;
    case "t": 
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target "+c[2]);
	    actionrlock.notify();
	    break;
	}
	var t=squadron[j];
	if (typeof Unit.prototype.removetarget.vanilla=="function") 
	    Unit.prototype.removetarget.vanilla.call(u,t);
	else Unit.prototype.removetarget.call(u,t);
	actionrlock.notify();
	break;
    case "T":
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target "+c[2]);
	    actionrlock.notify();
	    break;
	}
	var t=squadron[j];
	if (typeof Unit.prototype.addtarget.vanilla=="function") 
	    Unit.prototype.addtarget.vanilla.call(u,t);
	else Unit.prototype.addtarget.call(u,t);
	actionrlock.notify();
	break;
    case "R": u.setarcrotate(parseInt(c[2],10)); 
	actionrlock.notify();
	break;
    case "s": Unit.prototype.removeshield.call(u,parseInt(c[2],10)); 
	u.show();
	actionrlock.notify();
	break;
    case "S": Unit.prototype.addshield.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "h": Unit.prototype.removehull.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "H": Unit.prototype.addhull.call(u,parseInt(c[2],10));
	u.show();
	actionrlock.notify();
	break;
    case "f": 		   
	u.select();
	for (j in squadron) 
	    if (squadron[j].id==parseInt(c[2],10)) break;
	if (squadron[j].id!=parseInt(c[2],10)) {
	    console.log("cannot find target unit "+c[2]);
	    actionrlock.notify();
	} else {
	    targetunit=squadron[j];
	    u.activeweapon=parseInt(c[3],10);
	    if (!FAST) u.playfiresnd();
	    //u.log("fires on "+targetunit.name+" with "+u.weapons[u.activeweapon].name);
	    setTimeout(function() { actionrlock.notify(); }, (FAST?0:1000));
	}
	break;
    case "am": 
	u.select();
	u.m=(new Snap.Matrix()).translate(c[2]-300,c[3]-300).rotate(c[4],0,0);
	u.g.transform(u.m);
	u.geffect.transform(u.m);
	actionrlock.notify();
	break;
    case "c":
	(new Critical(u,parseInt(c[2],10))).faceup();
	actionrlock.notify();
	break;
    case "D":
	u.upgrades[parseInt(c[2],10)].desactivate();
	actionrlock.notify();
	break;
    case "m":
	u.select();
	var d=c[2];
	var l=parseInt(c[4],10);
	var oldm=u.m;
	var path=P[d].path;
	if (FAST) {
	    u.m=u.getmatrixwithmove(oldm,path,l);
	    u.m.rotate(parseFloat(c[3],0,0),0,0);
	    u.g.transform(u.m);
	    u.geffect.transform(u.m);
	    actionrlock.notify();
	    break;
	}
	SOUNDS[u.ship.flysnd].play();
	Snap.animate(0,l,function(value) {
	    var m=this.getmatrixwithmove(oldm,path,value);
	    this.g.transform(m);
	    this.geffect.transform(m);
	}.bind(u), TIMEANIM*l/200,mina.linear, function() {
	    this.m=this.getmatrixwithmove(oldm,path,l);
	    this.m.rotate(parseFloat(c[3]),0,0);
	    this.g.transform(this.m);
	    this.geffect.transform(this.m);
	    actionrlock.notify();
	}.bind(u));
	break;
    default: 
	console.log("unknown cmd:"+c[1]);
	FAST=false;
	filltabskill();
	setphase((phase==SETUP_PHASE));
    }
}
var phase=1;
var subphase=0;
var round=1;
var skillturn=0;
var tabskill;
var VERSION="v0.9.2";
var LANG="en";
var ENGAGED=false;
var FILTER="none";
var DECLOAK_PHASE=1;
var WEBSITE="file:///Users/denis/Documents/bench/index.html";
var DICES=["focusred","hitred","criticalred","blankred","focusgreen","evadegreen","blankgreen"];
var SETUP_PHASE=2,PLANNING_PHASE=3,ACTIVATION_PHASE=4,COMBAT_PHASE=5,SELECT_PHASE=1,CREATION_PHASE=6,XP_PHASE=7;
var BOMBS=[];
var ROCKDATA="";
var WINCOND=0;
var INREPLAY=false;
var allunits=[];
var PILOT_translation,SHIP_translation,CRIT_translation,UI_translation,UPGRADE_translation,PILOT_dict,UPGRADE_dict,RATINGS_upgrades,RATINGS_ships,RATING_pilots,TOP_squads;
var actionr=[];
var actionrlock;
var HISTORY=[];
var replayid=0;
var dice=1;
var ATTACK=[]
var DEFENSE=[]
var SEARCHINGSQUAD;
var FACTIONS={"rebel":"REBEL","empire":"EMPIRE","scum":"SCUM"};
var SQUADLIST,SCENARIOLIST;
var TEAMS=[new Team(0),new Team(1),new Team(2),new Team(3)];
var currentteam=TEAMS[0];
var teamtarget=0;
var VIEWPORT;
var ANIM="";
var SETUP;
var SHOWDIAL=[];
var TRACE=false;
var TEMPLATES={};
var FE_EVADE=1;
var FE_FOCUS=10;
var FCH_HIT=1;
var FCH_FOCUS=100;
var FCH_CRIT=10;
var HEADER="";
var SCENARIOTITLE="";
var WAVEFILTER="0";
var UNITFILTER={};
var ACTIONFILTER={};
var MOVEFILTER={};
var TEXTFILTER="";
var COSTFILTER=50;

var UNIQUE=[];
var stype="";
var REPLAY="";
var PERMALINK="";
/*



    <script src="src/obstacles.js"></script>
    <script src="src/team.js"></script>
    <script src="src/units.js"></script>
    <script src="src/upgrades.js"></script>
    <script src="src/upgcards.js"></script>
    <script src="src/critical.js"></script>
    <script src="src/pilots.js"></script>
    <script src="src/iaunits.js"></script>
<script src="src/replay.js"></script>
<script src="src/proba.js"></script>
    <script src="src/xwings.js"></script>


*/

var SETUPS={
     "Classic": {
	"background":"css/playmat10.jpg",
	 "zone1":"M 0 0 L 100 0 100 900 0 900 Z",
	 "zone2":"M 800 0 L 900 0 900 900 800 900 Z",
	 "playzone1":"M 0 0 L 900 0 900 900 0 900 Z",
         "asteroids":6
    },
    "Cloud City": {
	"background":"css/playmat6.jpg",
	"zone1":"M 0 0 L 100 0 100 900 0 900 Z",
	"zone2":"M 800 0 L 900 0 900 900 800 900 Z",
	"playzone1":"M 0 0 L 900 0 900 900 0 900 Z",
        "asteroids":6
    },
    "Blue Sky": {
	"background":"css/playmat13.jpg",
	"zone1":"M 0 0 L 100 0 100 900 0 900 Z",
	"zone2":"M 800 0 L 900 0 900 900 800 900 Z",
	"playzone1":"M 0 0 L 900 0 900 900 0 900 Z",
        "asteroids":0
    },
    "Blue Planet": {
	"background":"css/playmat11.jpg",
	"zone1":"M 0 0 L 100 0 100 900 0 900 Z",
	"zone2":"M 800 0 L 900 0 900 900 800 900 Z",
	"playzone1":"M 0 0 L 900 0 900 900 0 900 Z",
        "asteroids":6
    },
    "Mars": {
	"background":"css/playmat14.jpg",
	"zone1":"M 0 0 L 100 0 100 900 0 900 Z",
	"zone2":"M 800 0 L 900 0 900 900 800 900 Z",
	"playzone1":"M 0 0 L 900 0 900 900 0 900 Z",
        "asteroids":6
    },
    "Defender":{
        "playzone1":"M 0 0 L 900 0 900 900 0 900 Z",
        "playzone2":"M280,450a170,170 0 1,0 340,0a170,170 0 1,0 -340,0",
        "background":"css/playmat10.jpg",
        "zone2":"M280,450a170,170 0 1,0 340,0a170,170 0 1,0 -340,0",
        "zone1":"M 0 0 L 100 0 100 900 0 900 Z",
        "asteroids":12
    }
}

function setSetup(n) {
    if (typeof SETUPS[n]!="undefined") {
	SETUP=SETUPS[n];
	SETUP.name=n;
    } else {
	SETUP=SETUPS["Classic"];
	SETUP.name="Classic";
    }
    if (typeof SETUP.playzone2=="undefined") SETUP.playzone2=SETUP.playzone1;
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function changeimage(input) {
    if (input.files && input.files[0]) {
	var reader=new FileReader();
	reader.onload=function(e) {
	    var bb=ZONE[0].getBBox();
	    var BACKGROUND = s.image(e.target.result,0,0,bb.w,bb.h).pattern(0,0,bb.w,bb.h);
	    ZONE[0].attr({fill:BACKGROUND,fillOpacity:1});

	}
	reader.readAsDataURL(input.files[0]);
    }
}
function center() {
    var bbox=activeunit.g.getBBox();
    var xx=(bbox.x+bbox.width/2);
    var yy=(bbox.y+bbox.height/2)
    var w=$("#svgout").width();
    var h=$("#svgout").height();
    var startX=0;
    var startY=0;
    if (h>w) startY=(h-w)/2;
    else startX=(w-h)/2;
    var min=Math.min(w/900.,h/900.);
    var x=startX+VIEWPORT.m.x(xx,yy)*min;
    var y=startY+VIEWPORT.m.y(xx,yy)*min
    var mm=VIEWPORT.m.invert();
    if (x<0||x>w) VIEWPORT.m=MT((-x+w/2-startX)/min,0).add(VIEWPORT.m);
    if (y<0||y>h) VIEWPORT.m=MT(0,(-y+h/2-startY)/min).add(VIEWPORT.m);

    VIEWPORT.transform(VIEWPORT.m);
    activeunit.show();
}
var AIstats = function(error,options, response) {
    if (typeof response.rows!="undefined") {
	//log("rows: "+response.rows.length);
    	for (var i=1; i<response.rows.length; i+=200) {
	    var scorec=0;
	    var n=0;
	    var median=0;
	    for (var j=1; j<200&&j+i<response.rows.length; j++) {
		var t=response.rows[i+j].cellsArray[0].split(" ");
		var ts1=t[0].split(":");
		var type1=ts1[0];
		var score1=ts1[1];
		var ts2=t[1].split(":");
		var type2=ts2[0];
		var score2=ts2[1];
		var scoreco=0;
		var scoreh=0;
		if (type2!=type1) {
		    if (type2=="Player") scoreh+=parseInt(score2,10);
		    else scoreco+=parseInt(score2,10);
		    if (type1=="Player") scoreh+=parseInt(score1,10);
		    else scoreco+=parseInt(score1,10);
		    median+=Math.floor((scoreco)/(scoreco+scoreh)*100);
		    n++;
		}
	    }
	}
    }
}
var mk2split = function(t) {
    var tt=t.split("\.");
    var r=[];
    var missing=false;
    for (var i=1; i<tt.length; i++) {
	if (tt[i].match(/_II.*/)) { r.push(tt[i-1]+"."+tt[i]); tt[i]=null; missing=false;} 
	else { if (tt[i-1]) r.push(tt[i-1]); missing=true; }
    }
    if (missing) r.push(tt[tt.length-1]);
    return r;
}
var save=function() {
    movelog("W");
    var url=WEBSITE+"?"+permalink(false);
    $(".social").html(Mustache.render(TEMPLATES["social"],{ 
	url:url,
	name:"save this link",
	encodedurl:encodeURI(url)}));
    if (typeof gapi!="undefined"
	&&typeof gapi.client!="undefined"
	&&typeof gapi.client.urlshortener!="undefined") {
	var request = gapi.client.urlshortener.url.insert({
            'longUrl': url
	});    
	request.then(function(response) {
	    var url=response.result.id;
	    $(".tweet").show();
	    $('#submission').contents().find('#entry_245821581').val(url);
	    $('#submission').contents().find("#ss-form").submit();  
	    $(".social").html(Mustache.render(TEMPLATES["social"],{ 
		url:url,
		name:url,
		encodedurl:encodeURI(url) }));
	}, function(reason) {
	    $('#submission').contents().find("#ss-form").submit();
            console.log('Error: ' + reason.result.error.message);
	});
    } else {
	$('#submission').contents().find("#ss-form").submit();
    }
}

var myCallbacksl = function (error, options, response) {
    if (response!=null&&typeof response.rows!="undefined") {
	//console.log("found "+response.rows.length+" answers");
	for (var i=1; i<response.rows.length; i++) {
	    try {
		//console.log(response.rows[i].cellsArray);
		myTemplatesl(i,response.rows[i].cellsArray,null,null);
	    } catch(e) {
	    }
	}
	//SQUADLIST.table.columns.adjust().draw();
    }
};

var myTemplate = function(o) { //num,cells,cellarrays,labels) {
    var cells = o.cellsArray;
    var s="";
    var t=cells[0].split(" ");
    if (t.length<2) return;
    var ts1=t[0].split(":");
    var type1=ts1[0];
    var score1=ts1[1];
    var ts2=t[1].split(":");
    var type2=ts2[0];
    var score2=ts2[1];
    var squad=cells[1];
    var tt=squad.split("VS");
    var team1=mk2split(tt[0]);
    var team2=mk2split(tt[1]);
    var t1="",s1="";
    console.log("FOUND:"+tt[0]+"### "+tt[1]);
    if (tt[0]==SEARCHINGSQUAD) { 
	var sc=score2,ts=type2; team1=team2; score2=score1; type2=type1; score1=sc; type1=ts; 
    }
    for (var j=0; j<team1.length-1; j++) {
	s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	t1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"<br>";
    }
    TEAMS[2].parseJuggler(s1,false);
    if (LANG!="en") {
	t1=TEAMS[2].toJuggler(true).replace(/\n/g,"<br>");
    }
    score1=""+score1;
    score2=""+score2;
    for (var i=0; i<3; i++) {
	if (score1.length<3) score1="0"+score1;
	if (score2.length<3) score2="0"+score2;
    }
    if (type2=="Player") score2="<b>"+score2+"</b>";
    if (type1=="Player") score1="<b>"+score1+"</b>";
    var xx=cells[2].split("?");
    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(xx[1]));
    var args=[];
    args= arg.split('&');
    //HEADER="";
    //SCENARIOTITLE="";
    if (args[6].split(-1)!="W")  {
	arg="";
	// A MODIFIER 
	//args[6]+="_-W";
	for (var i=0; i<args.length; i++) 
	    arg+=((i>0)?"&":"")+args[i];
	xx[0]="file:///Users/denis/Documents/bench/index.html";
	src=xx[0]+"?"+LZString.compressToEncodedURIComponent(arg);
    } else src=cells[2];
    //SQUADBATTLE.row.add([score2+"-"+score1,"<span onclick='$(\".replay\").attr(\"src\",\""+src+"\")'>"+t1+cells[3]+"</span>"]).draw(false);
    $("#squadbattlediv").html(Mustache.render(TEMPLATES["combat-display"],{opponent:t1,score:score2+" - "+score1}));
    $("#replay").attr("src",src);
    return "";
}

var computeurl=function(error, options,response) {
    //console.log(error,options,response);
    var scoreh=0;
    var scorec=0;
    var n=0;
    var histogram=[];
    if (typeof response.rows!="undefined") {
    	for (var i=1; i<response.rows.length; i++) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    var team1=mk2split(tt[0]);
	    var team2=mk2split(tt[1]);
	    var s1="",s2="";

	    for (var j=0; j<team1.length-1; j++) {
		s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    }
	    try {
		TEAMS[1].parseJuggler(s1,false);
	    for (var j=0; j<team2.length-1; j++) 
	    	s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    TEAMS[2].parseJuggler(s2,false);
	    } catch (e) {
	    }
	    for (var j in generics) {
		if (typeof histogram[generics[j].pilotid]=="undefined") 
		    histogram[generics[j].pilotid]=0;
		histogram[generics[j].pilotid]++;
	    }
	}
    }
    for (var i in histogram) {
	console.log(PILOTS[i].name+":"+histogram[i]);
    }
}
function translate(a) {
    if (typeof PILOT_translation[a]!="undefined"
	&&typeof PILOT_translation[a].name!="undefined") 
	return PILOT_translation[a].name;
    if (typeof PILOT_translation[a+" (Scum)"]!="undefined"
	&&typeof PILOT_translation[a+" (Scum)"].name!="undefined") 
	return PILOT_translation[a+" (Scum)"].name;
    if (typeof UPGRADE_translation[a]!="undefined"
	&&typeof UPGRADE_translation[a].name!="undefined") 
	return UPGRADE_translation[a].name;
    if (typeof UPGRADE_translation[a+"(Crew)"]!="undefined"
	&&typeof UPGRADE_translation[a+"(Crew)"].name!="undefined") 
	return UPGRADE_translation[a+"(Crew)"].name;
    if (typeof CRIT_translation[a]!="undefined"
	&&typeof CRIT_translation[a].name!="undefined")
	return CRIT_translation[a].name;
    return a;
}
function formatstring(s) {
    return s.replace(/%HIT%/g,"<code class='hit'></code>")
	.replace(/%ACTION%/g,"<b>Action:</b>")
	.replace(/%STRESS%/g,"<code class='xstresstoken'></code>")
	.replace(/%CRIT%/g,"<code class='critical'></code>")
	.replace(/%EVADE%/g,"<code class='symbols'>e</code>")
	.replace(/%FOCUS%/g,"<code class='symbols'>f</code>")
	.replace(/%SHIELD%/g,"<code class='cshield'></code>")
	.replace(/%HULL%/g,"<code class='chull'></code>")
	.replace(/%ROLL%/g,"<code class='symbols'>r</code>")
	.replace(/%TURNLEFT%/g,"<code class='symbols'>4</code>")
	.replace(/%TURNRIGHT%/g,"<code class='symbols'>6</code>")
	.replace(/%BOOST%/g,"<code class='symbols'>b</code>")
        .replace(/%ELITE%/g,"<code class='symbols'>E</code>")
	.replace(/%ION%/g,"<code class='xionizedtoken'></code>")
 	.replace(/%BOMB%/g,"<code class='symbols'>B</code>")
	.replace(/%STRAIGHT%/g,"<code class='symbols'>8</code>")
        .replace(/%STOP%/g,"<code class='symbols'>5</code>")
        .replace(/%TARGET%/g,"<code class='symbols'>l</code>")
        .replace(/%TORPEDO%/g,"<code class='symbols'>P</code>")
 	.replace(/%CANNON%/g,"<code class='symbols'>C</code>")
	.replace(/%SYSTEM%/g,"<code class='symbols'>S</code>")
	.replace(/%ILLICIT%/g,"<code class='symbols'>I</code>")
        .replace(/%MISSILE%/g,"<code class='symbols'>M</code>")
        .replace(/%TURRET%/g,"<code class='symbols'>U</code>")
        .replace(/%BANKLEFT%/g,"<code class='symbols'>7</code>")
        .replace(/%BANKRIGHT%/g,"<code class='symbols'>9</code>")
        .replace(/%UTURN%/g,"<code class='symbols'>2</code>")
        .replace(/%SLOOPLEFT%/g,"<code class='symbols'>1</code>")
        .replace(/%SLOOPRIGHT%/g,"<code class='symbols'>3</code>")
        .replace(/%TALONLEFT%/g,"<code class='symbols'>;</code>")
        .replace(/%TALONRIGHT%/g,"<code class='symbols'>:</code>")
        .replace(/%ASTROMECH%/g,"<code class='symbols'>A</code>")
	.replace(/%CREW%/g,"<code class='symbols'>W</code>")
	.replace(/%MOD%/g,"<code class='symbols'>m</code>")
	.replace(/%SLAM%/g,"<code class='symbols'>s</code>")
    ;
}
function displayplayertype(team,img) {
    var hname=localStorage["name"];
    //var name=localStorage["playername"];
    //if (typeof name!="undefined") hname=name;
    var t={"REBEL":"x","EMPIRE":"y","SCUM":"z"}
    if (!TEAMS[team].isia) {
	$("#player"+team+" option[value='human']").prop("selected",true); 
	$("#player"+team+" option[value='human']").text(UI_translation["human"]);
    } else {
	$("#player"+team+" option[value='computer']").prop("selected",true);	$("#player"+team+" option[value='computer']").text(UI_translation["computer"]);
 
    } 
    $("#playerteam"+team).text(t[TEAMS[team].faction]);
}
function nextunit(cando, changeturn,changephase,activenext) {
    var i,sk=false,last=0;
    if (skillturn<0||skillturn>12) return changephase();
    for (i=0; i<tabskill[skillturn].length; i++) {
	var u=tabskill[skillturn][i];
	if (cando(u)&&u.isdocked!=true) { sk=true; last=i; break;} 
    };
    if (!sk) {
	do {
	    changeturn(tabskill);
	    last=0;
	    if (skillturn>=0 && skillturn<=12) {
		while (last<tabskill[skillturn].length&&(tabskill[skillturn][last].isdocked==true||!cando(tabskill[skillturn][last]))) last++;
		if (last==tabskill[skillturn].length) last=-1;
	    }
	} while (skillturn>=0 && skillturn<=12 && last==-1);
    } 
    if (skillturn<0||skillturn>12||last==-1) return changephase();
    barrier(function() {
	active=last; 
	
	tabskill[skillturn][last].select();
	activenext();
    });
}
function endphase() {
    for (var i in squadron) squadron[i].endphase();
}
function nextcombat() {
    nextunit(function(t) { return t.canfire(); },
	     function(list) { 
		 var dead=false;
		 if (skillturn>=0) skillturn--;
		 for (var i=0; i<list[skillturn+1].length; i++) {
		     var u=list[skillturn+1][i];
		     if (u.canbedestroyed(skillturn))
			 if (u.checkdead()) dead=true;
		 }
		 if (dead&&TEAMS[1].checkdead()&&TEAMS[2].checkdead()) win(0);
		 if (dead&&TEAMS[1].checkdead()) win(1);
		 if (dead&&TEAMS[2].checkdead())  win(2);
	     },
	     function() {
		 return enablenextphase();
	     },
	     function() {
		 activeunit.beginattack();
		 activeunit.doattack();
	     });
}
function nextactivation() {
    nextunit(function(t) { return t.candomaneuver(); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { 
		 //barrier(endphase); 
		 return enablenextphase(); },
	     function() {    
		 activeunit.beginactivation();
		 activeunit.doactivation();
	     });
}
function nextdecloak() {
    nextunit(function(t) { return t.candecloak(); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() { activeunit.dodecloak(); });
}
function nextplanning() {
    nextunit(function(t) { return (t.maneuver==-1); },
	     function() { if (skillturn<13) skillturn++; },
	     function() { return enablenextphase(); },
	     function() {
		 activeunit.select();
		 activeunit.doplan();
	     });
}
function getattackresult() {
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    return FCH_CRIT*c+FCH_HIT*h;
}
function getdefenseresult() {
    return $(".evadegreendice").length+$(".evadegreen").length;
}
function addattackdie(type,n) {
    for (var i=0; i<n; i++) 
	$("#attack").append("<td class="+type+"reddice'></td>");
}
function adddefensedie(type,n) {
    for (var i=0; i<n; i++) 
	$("#defense").append("<td class="+type+"greendice'></td>");
}
function getattackdice() {
    return $(".focusreddice").length+$(".criticalreddice").length+$(".hitreddice").length+$(".blankreddice").length;
}
function getattackvalue() {
    return $(".focusreddice").length*FCH_FOCUS+$(".criticalreddice").length*FCH_CRIT+$(".hitreddice").length*FCH_HIT;
}
function getdefensedice() {
    return $(".focusgreendice").length+$(".blankgreendice").length+$(".evadegreendice").length; 
}
function displaycombatdial() {
    $("#attackdial").empty();
    $("#dtokens").empty();
    $("#defense").empty();
    $("#combatdial").show();
}
function addredclickchange() {
    var change=function() { 
	if ($(this).hasClass("focusreddice")) {
	    $(this).removeClass("focusreddice"); $(this).addClass("hitreddice");
	}  else if ($(this).hasClass("blankreddice")) {
	    $(this).removeClass("blankreddice"); $(this).addClass("focusreddice");
	} else if ($(this).hasClass("hitreddice")) {
	    $(this).removeClass("hitreddice"); $(this).addClass("criticalreddice");
	} else if ($(this).hasClass("criticalreddice")) {
	    $(this).removeClass("criticalreddice"); $(this).addClass("blankreddice");
	}
    }
    $(".focusreddice").click(change);
    $(".hitreddice").click(change);
    $(".blankreddice").click(change);
    $(".criticalreddice").click(change);
}
function displayattackroll(m,n) {
    var i,j=0;
    for (i=0; i<DICES.length; i++) $("."+DICES[i]+"dice").remove();
    $("#attack").empty();
    for (i=0; i<Math.floor(m/100)%10; i++,j++)
	$("#attack").append("<td class='focusreddice'></td>");
    for (i=0; i<(Math.floor(m/10))%10; i++,j++)
	$("#attack").append("<td class='criticalreddice'></td>");
    for (i=0; i<m%10; i++,j++)
	$("#attack").append("<td class='hitreddice'></td>");
    for (i=j; i<n; i++)
	$("#attack").append("<td class='blankreddice'></td>");
    addredclickchange();
}
function displayattacktokens(u,f) {
    $("#atokens").empty();
    var dm=targetunit.getresultmodifiers(u.ar,u.ad,DEFENSE_M,ATTACK_M);
    if (dm.length>0) {
	$("#atokens").append(dm);
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    displayattacktokens2(u,f);
	}))
    } else displayattacktokens2(u,f);
}
function displayattacktokens2(u,f) {
    if (typeof f!="function") f=u.lastaf;
    else u.lastaf=f;
    $("#atokens").empty();
    var am=u.getresultmodifiers(u.ar,u.ad,ATTACK_M,ATTACK_M);
    if (am.length>0) {
	$("#atokens").append(am);
	$("#atokens").append($("<button>").addClass("m-done").click(function() {
	    $("#atokens").empty();
	    this.endmodifyattackstep();
	    f(this);}.bind(u)));
    } else f(u);
}
function displaydefensetokens(u,f) {
    $("#dtokens").empty();
    var dm=activeunit.getresultmodifiers(u.dr,u.dd,ATTACK_M,DEFENSE_M);
    if (dm.length>0) {
	$("#dtokens").append(dm);
	//$("#dtokens td").click(function() { displaydefensetokens(u,f); });
	$("#dtokens").append($("<button>").addClass("m-done").click(function() {
	    displaydefensetokens2(u,f);
	}))
    } else displaydefensetokens2(u,f);
}
function displaydefensetokens2(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    var dm=u.getresultmodifiers(u.dr,u.dd,DEFENSE_M,DEFENSE_M);
    if (FAST) { 	    
	//$("#combatdial").hide(); 
	displaycompareresults(u,f);
	//f(); 
    } else {
	$("#dtokens").append(dm);
	$("#dtokens").append($("<button>").addClass("m-fire").click(function() {
	    //$("#combatdial").hide();
	    //f();
	    this.endmodifydefensestep();
	    displaycompareresults(activeunit,f);
	}.bind(u)));
    }
}
function displaycompareresults(u,f) {
    if (typeof f!="function") f=u.lastdf;
    u.lastdf=f;
    $("#dtokens").empty();
    dm=targetunit.getresultmodifiers(targetunit.dr,targetunit.dd,ATTACKCOMPARE_M,DEFENSE_M);
    am=u.getresultmodifiers(u.ar,u.ad,ATTACKCOMPARE_M,ATTACK_M);
    if (FAST||(dm.length==0&&am.length==0)) {
	$("#combatdial").hide();
	//log("hiding combat dial compare");
	f();
    } else {
	$("#dtokens").append(dm).append(am);
	$("#dtokens").append($("<button>").addClass("m-fire").click(function() {
	    $("#combatdial").hide();
	    //log("hiding combat dial finally");
	    f();}.bind(u)));
    }
}
function FE_focus(r) {
    return Math.floor(r/10)%10;
}
function FE_evade(r) {
    return r%10;
}
function FE_blank(r,n) {
    return n-FE_evade(r)-FE_focus(r);
}
function FCH_hit(r) {
    return r%10;
}
function FCH_focus(r) {
    return Math.floor(r/100)%10;
}
function FCH_crit(r) {
    return Math.floor(r/10)%10;
}
function FCH_blank(r,n) {
    return n-FCH_crit(r)-FCH_focus(r) - FCH_hit(r);
}

function costfilter(s) {
    if (typeof s=="undefined") COSTFILTER=10;
    else COSTFILTER=parseInt(s,10);
    displayfactionunits(true);
}
function wavefilter(s) {
    WAVEFILTER=s;
    displayfactionunits(true);
}
function unitfilter(s) {
    var i,j;
    if (typeof UNITFILTER[s]!="undefined") delete UNITFILTER[s];
    else UNITFILTER[s]=true;
    displayfactionunits(true);
}
function actionfilter(s) {
    var i,j;
    if (typeof ACTIONFILTER[s]!="undefined") delete ACTIONFILTER[s];
    else ACTIONFILTER[s]=true;
    displayfactionunits(true);
}
function textfilter(s) {
    TEXTFILTER=s;
    displayfactionunits(true);
}

function addroll(f,id,to) {
    if (to==DEFENSE_M) return addrolld(f,id);
    var n=getattackdice();
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var t=f(100*foc+10*c+h,n);
    displayattackroll(t.m,t.n);
    $("#atokens #mod"+id).remove();
}
function addrolld(f,id) {
    var n=getdefensedice();
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var t=f(10*foc+e,n);
    displaydefenseroll(t.m,t.n);
    $("#dtokens #mod"+id).remove();
}
function modroll(f,id,to) {
    if (to==DEFENSE_M) return modrolld(f,id);
    var n=getattackdice();
    var foc=$(".focusreddice").length;
    var h=$(".hitreddice").length;
    var c=$(".criticalreddice").length;
    var r=f(100*foc+10*c+h,n);
    displayattackroll(r,n);
    $("#atokens #mod"+id).remove();
}
function modrolld(f,id) {
    var n=getdefensedice();
    var foc=$(".focusgreendice").length;
    var e=$(".evadegreendice").length;
    var r=f(10*foc+e,n);
    displaydefenseroll(r,n);
    $("#dtokens #mod"+id).remove();
}
function addgreenclickchange() {
    var change=function() { 
	if ($(this).hasClass("focusgreendice")) {
	    $(this).removeClass("focusgreendice"); $(this).addClass("evadegreendice");
	} else if ($(this).hasClass("blankgreendice")) {
	    $(this).removeClass("blankgreendice"); $(this).addClass("focusgreendice");
	} else if ($(this).hasClass("evadegreendice")) {
	    $(this).removeClass("evadegreendice"); $(this).addClass("blankgreendice");
	}
    }
    $(".focusgreendice").click(change);
    $(".evadegreendice").click(change);
    $(".blankgreendice").click(change);
}
function displaydefenseroll(r,n) {
    var i,j=0;
    $("#defense").empty();
    for (i=0; i<Math.floor(r/10); i++,j++)
	$("#defense").append("<td class='focusgreendice'></td>");
    for (i=0; i<r%10; i++,j++)
	$("#defense").append("<td class='evadegreendice'></td>");
    for (i=j; i<n; i++)
	$("#defense").append("<td class='blankgreendice'></td>");
    addgreenclickchange();
}

function reroll(n,from,to,a,id) {
    var i,l,m=0;
    var attackroll=["blank","focus","hit","critical"];
    var attackcode=[" ","%FOCUS%","%HIT%","%CRIT%"];
    var defenseroll=["blank","focus","evade"];
    if (typeof a.f=="function") a.f();
    var str="";
    if (to==ATTACK_M) {
	for (i=0; i<4; i++) {
	    // Do not reroll focus
	    if (activeunit.hasnorerollmodifiers(from,to,getattackvalue(),getattackdice(),"focus")&&typeof a.mustreroll=="undefined"&&attackroll[i]=="focus") continue;
	    if (a.dice.indexOf(attackroll[i])>-1) {
		l=$("."+attackroll[i]+"reddice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    str+=("<span class='"+attackroll[i]+"reddice'></span>").repeat(l.length);
		    m+=l.length;
		    n-=l.length;
		} else {
		    $("."+attackroll[i]+"reddice:lt("+n+"):not([noreroll])").remove();
		    str+=("<span class='"+attackroll[i]+"reddice'></span>").repeat(n);
		    m+=n;
		    n=0;
		    break;
		}
	    }
	}
	str+=" -> ";
	$("#atokens #reroll"+id).remove();
	var r=activeunit.rollattackdie(m);
	for (i=0; i<m; i++) {
	    //$("#attack").prepend("<td noreroll='true' class='"+r[i]+"reddice'></td>");
	    str+="<span class='"+r[i]+"reddice'></span>";
	    $("#attack").append("<td class='"+r[i]+"reddice' noreroll></td>");
	}
	//activeunit.log("reroll: "+str);
	addredclickchange();
    } else { 
	for (i=0; i<3; i++) {
	    // Do not reroll focus
	    if (typeof a.mustreroll=="undefined"&&targetunit.hasnorerollmodifiers(from,to,getattackvalue(),getattackdice(),"focus")&&attackroll[i]=="focus") continue;
	    if (a.dice.indexOf(defenseroll[i])>-1) {
		l=$("."+defenseroll[i]+"greendice:not([noreroll])");
		if (l.length<n) {
		    l.remove();
		    m+=l.length;
		    n-=l.length;
		} else {
		    $("."+attackroll[i]+"greendice:lt("+n+"):not([noreroll])").remove();
		    m+=n;
		    n=0;
		    break;
		}
	    }
	}
	$("#dtokens #reroll"+id).remove();
	activeunit.defenseroll(m).done(function(r) {
	    var i;
	    for (i=0; i<FE_evade(r.roll); i++)
		$("#defense").append("<td class='evadegreendice'></td>");
	    for (i=0; i<FE_focus(r.roll); i++)
		$("#defense").append("<td class='focusgreendice'></td>");
	    for (i=0; i<FE_blank(r.roll,r.dice); i++)
		$("#defense").append("<td class='blankgreendice'></td>");
	    addgreenclickchange();
	});
    }
}
function next_replay() {
    var p=[];
    if (REPLAY.length>0) p=REPLAY[replayid].split("_");
    return p;
}

function enablenextphase() {
    var i;
    var ready=true;

    switch(phase) {
    case SELECT_PHASE:
	var n1=$("#squad1points").text()
	var n2=$("#squad2points").text()
	if (parseInt(n1,10)==0||parseInt(n2,10)==0) {
	    ready=false;
	    $(".nextphase").addClass("disabled");
	}
	break;
    case PLANNING_PHASE:
	for (i in squadron)
	    if (squadron[i].maneuver<0&&!squadron[i].isdocked) { ready=false; break; }
	if (ready&&$(".nextphase").hasClass("disabled")) log(UI_translation["All units have planned a maneuver, ready to end phase"]);
	break;
    case ACTIVATION_PHASE:
	if (subphase!=ACTIVATION_PHASE) {
	    subphase=ACTIVATION_PHASE; 
	    skillturn=0; 
	    ready=false;
	    for (i in squadron) squadron[i].enddecloak().done(nextactivation);
	    barrier(nextactivation);
	} else {
	    for (i in squadron)
		if (squadron[i].maneuver>-1&&!squadron[i].isdocked) { ready=false; break; }
	    if (ready&&$(".nextphase").hasClass("disabled")) log(UI_translation["All units have been activated, ready to end phase"]);
	}
	break;
    case COMBAT_PHASE: 
	if (skillturn<0) {
	    $("#attackdial").hide();
	    for (var i in squadron) squadron[i].endcombatphase();
	    log(UI_translation["No more firing units, ready to end phase."]);
	    barrier(endphase);
	    ready=true; 
	} else ready=false;
	break;
    }
    
    if (ready) $(".nextphase").removeClass("disabled");
    //log("ready "+ready);
    if (ready&&FAST&&phase>=SETUP_PHASE) 
	return nextphase();
    // Replay
    /*var p=next_replay();
    if (REPLAY.length>0&&next_replay()[0]=="nextphase") {
	log("<div style='color:white;background:blue'>##"+p[0]+":"+p[1]+"</div>");
	replayid++;
	if (phase>=PLANNING_PHASE) return nextphase();
    } else log("<div style='color:white;background:green'>##"+p[0]+":"+p[1]+"</div>");
    */
    return ready;
}

function win(destroyed) {
    movelog("W");
    var title="m-draw";
    var i;
    var s1="",s2="";
    var defaults="<tr><td class='m-nocasualty'></td><td>0</td></tr>";
    var score1=0,score2=0;
    var saved1=false,saved2=false;
    for (i=0; i<allunits.length; i++) {
	var u=allunits[i];
	if (!u.dead&&u.team==1) saved1=true;
	if (!u.dead&&u.team==2) saved2=true;
	if (u.dead||(u.islarge&&u.shield+u.hull<(u.ship.hull+u.ship.shield)/2)) {
	    var p=u.dead?u.points:(u.points/2);
	    if (u.team==1) {
		s2+="<tr><td>"+u.name+(!u.dead?" (1/2 points)":"")+"</td><td>"+p+"</td></tr>";
		score2+=p;
	    } else {
		s1+="<tr><td>"+u.name+(!u.dead?" (1/2 points)":"")+"</td><td>"+p+"</td></tr>";
		score1+=p;
	    }
	}
    }
    if (saved1==false) score2=100;
    if (saved2==false) score1=100;
    if (s1=="") s1=defaults;
    if (s2=="") s2=defaults;
    var d=score1 - score2;
    score1 = d + 100;
    score2 = 100 - d;
//    var meanhit=Math.floor(1000*TEAMS[1].allhits/TEAMS[1].allred)/1000;
//    var meancrit=Math.floor(1000*TEAMS[1].allcrits/TEAMS[1].allred)/1000;
//    var str="<td rowspan='2' class='probacell' >";
//    str+="<div style='font-size:smaller'>Average <span class='hit'></span>/die:"+meanhit+" (norm:0.375)</div><div>Average <span class='critical'></span>/die:"+meancrit+" (norm:0.125)</div></td>";

    $(".victory-table").empty();
    $(".victory-table").append("<tr><th class='m-squad1'></th><th>"+score1+"</th></tr>");
    $(".victory-table").append(s1);
//    meanhit=Math.floor(1000*TEAMS[2].allhits/TEAMS[2].allred)/1000;
//    meancrit=Math.floor(1000*TEAMS[2].allcrits/TEAMS[2].allred)/1000;
//    var str="<td rowspan='2' class='probacell' >";
//    str+="<div style='font-size:smaller'>Average <span class='hit'></span>/die:"+meanhit+" (norm:0.375)</div><div>Average <span class='critical'></span>:"+meancrit+" (norm: 0.125)</div>/die</td>";
    $(".victory-table").append("<tr><th class='m-squad2'></th><th>"+score2+"</th></tr>");
    $(".victory-table").append(s2);
    if ((d>0&&WINCOND<0)||(destroyed==2&&(WINCOND>round||WINCOND==0))) title="m-1win";
    else if ((d<0&&WINCOND<0)||(destroyed==1&&(WINCOND>round||WINCOND==0))) title="m-2win";
    
    $(".victory").addClass(title);
    var titl = (TEAMS[1].isia?"Computer":"Player")+":"+score1+" "+(TEAMS[2].isia?"Computer":"Player")+":"+score2;
    var note=TEAMS[1].toJuggler(false);
    note+="VS"+TEAMS[2].toJuggler(false);
    note=note.replace(/\n/g,".");
    note=note.replace(/ \+ /g,"*");
    note=note.replace(/ /g,"_");
    var url=encodeURI(WEBSITE+"?"+permalink(false));
    $("#submission").contents().find('#entry_209965003').val(titl);
    $('#submission').contents().find('#entry_390767903').val(note);
    $('#submission').contents().find('#entry_245821581').val("no short url");
    $('#submission').contents().find('#entry_1690611500').val(url);
    $(".tweet").hide();
    save();
    for (i in ["email","facebook","tweet","googlep"]) {
	(function(n) {
	    $("."+n).click(function() {
		ga("send","event",{
		    eventCategory: 'social',
		    eventAction: 'send',
		    eventLabel: n
		});
	    });
	})(i);
    }
    $(".victory-link").attr("href",url);
    /*var y1=0,y2=0;
    var t1=TEAMS[1].history;
    var t2=TEAMS[2].history;
    var val1=[],val2=[];
    var y1=0,y2=0;
    var scalex=$('#svgLine').height()/round;
    for (i=0; i<=round; i++) {
	if (typeof t1.rawdata[i]!="undefined") { y1+=t1.rawdata[i].hits;}
	val1[i]=y1;
	if (typeof t2.rawdata[i]!="undefined") { y2+=t2.rawdata[i].hits;}
	val2[i]=y2;
    }
    var scaley=$('#svgLine').height()/Math.max(Math.max.apply(null,val1),Math.max.apply(null,val2));
    for (i=0; i<=round; i++) { val1[i]*=scaley; val2[i]*=scaley; }

    sl = Snap('#svgLine');*/
    //sl.path("M 0 0 L "+val1);
    //sl.polyline(val2);
    //makeGrid();
    //makePath(val1,'red');
    //makePath(val2,'blue');
    window.location="#modal";
}
//document.addEventListener("win",win,false);

function createsquad(f) {
    var faction=currentteam.faction;
    if (typeof f!="undefined") faction=f;
    $(".activeunit").prop("disabled",true);
    //$("#selectphase").hide();
    //$("#addcomment").hide();
    /*ga('send','event', {
	eventCategory: 'interaction',
	eventAction: 'create',
	eventLabel: 'create'
    });*/
    //phase=CREATION_PHASE;
    //$("footer").hide();
    $('#consolecb').removeAttr('Checked');
    //$(".nextphase").prop("disabled",false);
    currentteam.changefaction(faction);
    $(".factionselect selected").val(faction);
    //$("#creation").show();
    var u={};
    u.getdial=function() {
	return 	[
	    {"move":"TL1","difficulty":"WHITE"},
	    {"move":"BL1","difficulty":"WHITE"},
	    {"move":"F1","difficulty":"WHITE"},
	    {"move":"SL2","difficulty":"WHITE"},
	    {"move":"TL2","difficulty":"WHITE"},
	    {"move":"BL2","difficulty":"WHITE"},
	    {"move":"F2","difficulty":"WHITE"},
	    {"move":"K2","difficulty":"WHITE"},
	    {"move":"SL3","difficulty":"WHITE"},
	    {"move":"TL3","difficulty":"WHITE"},
	    {"move":"BL3","difficulty":"WHITE"},
	    {"move":"F3","difficulty":"WHITE"},
	    {"move":"K3","difficulty":"WHITE"},
	    {"move":"F4","difficulty":"WHITE"},
	    {"move":"K4","difficulty":"WHITE"},
	    {"move":"F5","difficulty":"WHITE"},
	    {"move":"K5","difficulty":"WHITE"}
	];
    };
    //$(".m-create").hide();
    //$(".title").html("Squad Building");
    $(".dialfilter").html(Unit.prototype.getdialstring.call(u));
    $(".dialfilter td[move]").click(function() { 
	var m=$(this).attr("move"); 
	if (typeof MOVEFILTER[m]!="undefined") {
	    delete MOVEFILTER[m];
	    $(this).removeClass("selected");
	} else { 
	    MOVEFILTER[m]=true;
	    $(this).addClass("selected");
	}
	displayfactionunits(true);
    });
    displayfactionunits(false);
    for (var i in generics) {
	var u=generics[i];
	if (u.team==currentteam.team) {
	    addunit(u.pilotid,currentteam.faction,u);
	    for (var j=0; j<u.upgradetype.length; j++) {
		var upg=u.upg[j];
		if (upg>-1) {
		    addupgrade(u,upg,j);
		}
	    }
	}
    }
}
function switchdialimg(b) {
    if (b==true) {
	$("#caroussel .shipimg").css("display","none");
	$("#caroussel .shipdial").css("display","table-cell");
    } else {
	$("#caroussel .shipdial").css("display","none");
	$("#caroussel .shipimg").css("display","table-cell");
    }
}
var mySpreadsheets=[
/*"https://docs.google.com/spreadsheets/d/1n35IFydakSJf9N9b9byLog2MooaWXk_w8-GQdipGe8I/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1Jzigt2slBhygjcylCsy4UywpsEJEjejvtCfixNoa_z4/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1dkvDxaH3mJhps9pi-R5L_ttK_EmDKUZwaCE9RZUYueg/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1IoViAKvpZFRlmzBXeY6S9jYX4Ju9ccL5boNxhLwUXiY/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1D2UbgrM6V7KJcRmyUQBxn5jxT-Nj8UGlpvLYlasH6TQ/edit#gid=0",
"https://docs.google.com/spreadsheets/d/15pAnwcBlp4l01eJgyNXW9uGu5jYDhxk3oSveBIQhJFc/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1P64wZXXV_3gJE0wdLTDWW2pdOliInCRlTXm1lgYNumc/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1zlqDnXJ9J-k4apP1DadPx_vdv6Asdp_b9QvaytKI9ek/edit#gid=0",
"https://docs.google.com/spreadsheets/d/1hK3niJbtDIE8xxv-9vQGcqd5eQ1D6dP5hQ7GicDVh-A/edit#gid=0",*/
"https://docs.google.com/spreadsheets/d/1KR1uc7QgbiDkxCU5J1rm9qBMMjwKC0WyfAuDhnrbgAA/edit#gid=0"
];

function displayAIperformance() {
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadbattlediv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select B",// where C ends with '"+t+"' or C starts with '"+t+"'",
	    callback:AIstats,
	    rowTemplate:function () { return "";},
	    labels:["Score"]
	});
    }   
}
function selectrocks() {
    var ROCKSHAPES=[1,2,3,4,5,6];
    $(".aster img").click(function(e) {
	var i=parseInt(e.target.id.substr(1),10);
	if (ROCKSHAPES.indexOf(i)>-1) {
	    ROCKSHAPES[i]=null;
	} else {
	    var j;
	    for (j=0; j<6; j++) if (ROCKSHAPES[j]==null) break; 
	    if (j<6) {
		ROCKSHAPES[j]=i;
		$("#a"+i).addClass("selected");
	    }
	}
    }.bind(this))
}


function recomputeurl() {
    $('#squadbattlediv').sheetrock({
	url: mySpreadsheets[0],
	query:"select C",
	callback:computeurl,
	rowTemplate:function () { return "";},
	labels:["ascii","short","long"]
    }); 
}
/* Unused ? */
function displaysquads(t) {
    var s1=t;
    t=t.replace(/\n/g,".");
    t=t.replace(/ \+ /g,"*");
    t=t.replace(/ /g,"_");
    SEARCHINGSQUAD=t;
    var t1="";
    /*
    if (LANG!="en") {
	TEAMS[0].parseJuggler(s1,false);
	s1=TEAMS[0].toJuggler(true);
    }*/
    t1=s1.replace(/\n/g,"<br>");

    //$("#squadlist").html(t1);
    //SQUADLIST.table.clear().draw();;
 
    for (var i=0; i<mySpreadsheets.length; i++) {
	$('#squadlistdiv').sheetrock({
	    url: mySpreadsheets[i],
	    query:"select C where C contains '"+t+"'",
	    callback:myCallbacksl,
	    fetchSize:2,
	    rowTemplate:function () { return "";},
	    labels:["","Type","Pts","Units","",""]
	});
    }   
}
function dial2JSON(dial) {
    var m=[];
    var j,k;
    for (j=0; j<=5; j++) m[j]={item:"",moves:null};
    for (j=0; j<dial.length; j++) {
	d=dial[j];
	var cx=MPOS[d.move][0],cy=MPOS[d.move][1];
	m[5-cx].item=cx;
	if (m[5-cx].moves==null) {
	    m[5-cx].moves=[];
	    for (k=0; k<=6; k++) m[5-cx].moves[k]={difficulty:"",key:""};
	}
	m[5-cx].moves[cy]={difficulty:d.difficulty,key:P[d.move].key};
    }
    return m;
}

function selectweapon(weapons) {
    $("#attackdial").html(Mustache.render(TEMPLATES["selectweapon"],weapons)).show();
}
function getpilottexttranslation(u,faction) {
    var idxn=u.name+(faction==SCUM?" (Scum)":"");
    if (typeof u.edition!="undefined") {
	var i=u.name+"("+u.edition+")";
	if (typeof PILOT_translation[i]!="undefined"&&typeof PILOT_translation[i].text!="undefined") return formatstring(PILOT_translation[i].text);
    }
    if (typeof PILOT_translation[idxn]!="undefined"&&typeof PILOT_translation[idxn].text!="undefined") return formatstring(PILOT_translation[idxn].text);
    return "";
}
function getupgtxttranslation(name,type) {
    var v=name+(type==CREW?"(Crew)":"");
    if (typeof UPGRADE_translation[v]!="undefined") {
	/*var faq=UPGRADE_translation[v].faq;
	if (typeof faq=="undefined") faq=""; else faq="<div style='color:grey'><strong>FAQ:</strong>"+faq+"</div>";*/
	if (typeof UPGRADE_translation[v].text!="undefined") return formatstring(UPGRADE_translation[v].text);
    }
    return "";
}

function importsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    currentteam.name="SQUAD."+currentteam.toASCII();
    var jug=currentteam.toJuggler(true);
    currentteam.toJSON(); // just for points
    localStorage[currentteam.name]=JSON.stringify({"pts":currentteam.points,"faction":currentteam.faction,"jug":currentteam.toJuggler(false)});
    SQUADLIST.addrow(t,currentteam.name,currentteam.points,currentteam.faction,jug);
}
function findsquad(t) {
    currentteam.parseJSON($("#squad"+t).val(),true);
    var jug=currentteam.toJuggler(false);
    var pattern=jug.replace(/ \+.*/g,"").replace(/\n/g,".*\.").replace(/ /g,"_");
    $('#squad'+t).sheetrock({
	url: mySpreadsheets[0],
	query:"select C where C matches '.*VS"+pattern+"'",
	callback:matchsquad,
	fetchSize:100,
	rowTemplate:function () { return "";},
	labels:["squad"]
    }); 
}
function matchsquad(error, options,response) {
    if (response!=null&&typeof response.rows!="undefined") {
	response.rows.sort(function(a,b) { return a.cellsArray[0]<b.cellsArray[0]; });
	var str="<ol>";
	var oldsquad="";
   	for (var i in response.rows) {
	    var squad=response.rows[i].cellsArray[0];
	    var tt=squad.split("VS");
	    if (tt[1]==oldsquad) continue;
	    str+="<li>"+tt[1]+"</li>";
	    oldsquad=tt[1];
	}
	str+="</ol>";
    }
}
function startcombat() {
}
function filltabskill() {
    var i;
    tabskill=[];
    for (i=0; i<=12; i++) tabskill[i]=[];
    for (i in squadron) tabskill[squadron[i].getskill()].push(squadron[i]);
    for (i=0; i<=12; i++) tabskill[i].sort(function(a,b) {
	var xa=0,xb=0;
	if (TEAMS[a.team].initiative==true) xa=1; 
	if (TEAMS[b.team].initiative==true) xb=1;
	if (xb-xa==0) return (b.id-a.id);
	return xb-xa;
    });
}

var ZONE=[];
function movelog(s) {
    ANIM+="_-"+s;
}
function endsetupphase() {
    $(".buttonbar .share-buttons").hide();
    $("#leftpanel").show();
    $(".bigbutton").hide();
    $(".playertype").prop("disabled",true);
    ZONE[2].remove();
    ZONE[3].remove();
    TEAMS[1].endsetup();
    TEAMS[2].endsetup();
    PERMALINK=permalink(true);
    $("#turnselector").append("<option value='0'>"+UI_translation["phase"+SETUP_PHASE]+"</option>");
    $(".playerselect").remove();
    $(".nextphase").addClass("disabled");
    $(".unit").css("cursor","pointer");
    $("#positiondial").hide();
    for (var i=0; i<OBSTACLES.length; i++) OBSTACLES[i].unDrag();
    HISTORY=[];
    for (var i in squadron) squadron[i].endsetupphase();
}
function nextphase() {
    var i;
    $("#savebtn").hide();
    //log("nextphase "+phase);
    // End of phases
    //if (!enablenextphase()) return;
    window.location="#";
    switch(phase) {
    case SELECT_PHASE:
	$(".permalink").show();
	$(".mainbutton").hide();
	$(".mainarticle").hide();
	$("article.headlines").hide();
	$("article.features").hide();
	$("nav").show();
	$("#game").show();
	//$(".title").html("Squadron Benchmark");
	$("#rightpanel").show();
	$("#leftpanel").show();
	
 	break;
    case SETUP_PHASE:
	if (mode==SCENARIOCREATOR) {
	    phase=SELECT_PHASE-1;
	    SCENARIOLIST.addrow(SCENARIOTITLE,HEADER,permalink(true));
	    break;
	}
	if ($("#player1 option:checked").val()=="human") 
	    TEAMS[1].isia=false; else TEAMS[1].isia=true;
	if ($("#player2 option:checked").val()=="human") 
	    TEAMS[2].isia=false; else TEAMS[2].isia=true;
	if (TEAMS[1].isia==true) TEAMS[1].setia();
	if (TEAMS[2].isia==true) TEAMS[2].setia();
	ZONE[0].attr({fillOpacity:0});
	ZONE[1].attr({fillOpacity:0});
	$(".imagebg").hide();
	endsetupphase();
	/*
	if (REPLAY.length>0) {
	    replayid=0;
	    for (var i=0; i<this.squadron.length; i++) 
		$.extend(this.squadron[i],ReplayUnit.prototype);

	}*/
	//$(".permalink").hide();
	break;
    case PLANNING_PHASE:
	$("#maneuverdial").hide();
	for (i in squadron) {
	    squadron[i].endplanningphase();
	}
	break;
    case ACTIVATION_PHASE:
	$("#activationdial").hide();
	for (i in squadron) {
	    squadron[i].hasmoved=false; 
	    squadron[i].hasdecloaked=false;
	    squadron[i].actiondone=false;
	    squadron[i].endactivationphase();
	}
	var b=[];
	for (i=0; i<BOMBS.length; i++) b[i]=BOMBS[i];
	for (i=0; i<b.length; i++) b[i].explode();
	break;
    case COMBAT_PHASE:
	$("#attackdial").hide();
	$("#listunits").html("");
	for (i in squadron) squadron[i].endround();
	$("#turnselector").append("<option value='"+round+"'>"+UI_translation["turn #"]+round+"</option>");
	round++;
	if (WINCOND<round&&WINCOND>0) win(0);
	if (-WINCOND<round&&WINCOND<0) win(0);
	break;
    }
    phase=(phase==COMBAT_PHASE)?PLANNING_PHASE:phase+1;
    movelog("P-"+round+"-"+(phase));
    if (phase==1) $("#phase").empty();
    else if (phase<3) $("#phase").html(UI_translation["phase"+phase]);
    else $("#phase").html(UI_translation["turn #"]+round+" "+UI_translation["phase"+phase]);
    $("#combatdial").hide();
    //if (phase>SELECT_PHASE) for (i in squadron) {squadron[i].unselect();}
    // Init new phase

    $(".nextphase").removeClass("disabled");
    setphase();
}
function setphase(cannotreplay) {
    $(".imagebg").hide();

    switch(phase) {
    case SELECT_PHASE:
	HEADER="";
	SCENARIOTITLE="";
	$("#addcomment").hide();
	$(".buttonbar .share-buttons").hide();
	$(".h2 .share-buttons").show();
	$(".permalink").hide();
	$(".activeunit").prop("disabled",true);
	$("#rightpanel").hide();
	$("#leftpanel").hide();
	$("#game").hide();
	$("nav").hide();
	$(".mainarticle").show();
	$(".headlines").show();
	$(".features").show();
	//$(".title").html("Squadron Benchmark");
	currentteam.setfaction("REBEL");
	$(".nextphase").addClass("disabled");
	createsquad();
	//window.location="#creation";
	break;
    case SETUP_PHASE:
	$(".imagebg").show();
	$("#addcomment").show();

	var t=["bomb","weapon","upgrade","social","condition","squad-display"];
	for (var i=0;i<t.length; i++) {
	    TEMPLATES[t[i]]=$("#"+t[i]).html();
	    Mustache.parse(TEMPLATES[t[i]]);
	}
	var name=UI_translation["human"];
	var computer=UI_translation["computer"];
	$("#player1").html("<option selected value='human'>"+name+"</option>");
	$("#player1").append("<option value='computer'>"+computer+"</option>");
	$("#player2").html("<option selected value='human'>"+name+"</option>");
	$("#player2").append("<option value='computer'>"+computer+"</option>");
	$("#player1").change(function() {
	    TEAMS[1].isia=!TEAMS[1].isia;
	    displayplayertype(1);
	});
	$("#player2").change(function() {
	    TEAMS[2].isia=!TEAMS[2].isia;
	    displayplayertype(2);
	});
	displayplayertype(1);
	displayplayertype(2);
	$(".bigbutton").show();
	$(".bigbutton2").prop("disabled",false);

	$(".buttonbar .share-buttons").show();
	$("#team2").css("top",$("nav").height()+2);
	$("#team1").css("top",$("nav").height()+2);
	$(".ctrl").css("display","block");
	
	ZONE[0]=s.path(SETUP.playzone1).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE1',
	        fillOpacity:0,
		pointerEvents:"none"
	    });
	if (SETUP.playzone1!=SETUP.playzone2) { 
	    ZONE[1]=s.path(SETUP.playzone2).attr({
		strokeWidth: 6,
		stroke:halftone(WHITE),
		strokeDasharray:"20,10,5,5,5,10",
		id:'ZONE2',
	        fillOpacity:0,
		pointerEvents:"none"
	    });
	    ZONE[1].appendTo(VIEWPORT);
	} else ZONE[1]=ZONE[0];
	$("#imagebg").change(function() {
	    changeimage(this);
	});
	if (SETUP.background!="") $(".playmat").css({background:"url("+SETUP.background+") no-repeat",backgroundSize:"100% 100%"});
	ZONE[0].appendTo(VIEWPORT);
	ZONE[2]=s.path(SETUP.zone1).attr({
		fill: TEAMS[1].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[2].appendTo(VIEWPORT);
	ZONE[3]=s.path(SETUP.zone2).attr({
		fill: TEAMS[2].color,
		strokeWidth: 2,
		opacity: 0.3,
		pointerEvents:"none"
	    });
	ZONE[3].appendTo(VIEWPORT);
	TEAMS[1].endselection(s);
	TEAMS[2].endselection(s);
	loadsound();

	if (HEADER!="") $("#titlecontent").html("<h1>"+SCENARIOTITLE+"</h1>"+HEADER);

	if (TEAMS[1].points>TEAMS[2].points) TEAMS[2].initiative=true;
	else if (TEAMS[2].points>TEAMS[1].points) TEAMS[1].initiative=true;
	else TEAMS[1].initiative=true;
	if (TEAMS[1].initiative==true) log("TEAM #1 has initiative");
	else log("TEAM #2 has initiative");
	$(".activeunit").prop("disabled",false);
	var i;

	for (i in squadron) if (!squadron[i].isdocked) break;
	activeunit=squadron[i];
	activeunit.select();
	activeunit.show();

	jwerty.key("f",function() {
	    console.log("SETUP:"+SETUP.name);
	});


	var zoom=function(centerx,centery,z) {
	    var w=$("#svgout").width();
	    var h=$("#svgout").height();
	    var startX=0;
	    var startY=0;
	    if (h>w) startY=(h-w)/2;
	    else startX=(w-h)/2;
	    var max=Math.max(900./w,900./h);
	    var offsetX=(centerx-startX)*max;
	    var offsetY=(centery-startY)*max;
	    var vm=VIEWPORT.m.clone().invert();
	    var x=vm.x(offsetX,offsetY);
	    var y=vm.y(offsetX,offsetY);
	    VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	    VIEWPORT.transform(VIEWPORT.m);
	    activeunit.show();
	}

	$("#svgout").bind('mousewheel DOMMouseScroll', function(event){
	    var e = event.originalEvent; // old IE support
	    var delta;
	    if (typeof e.wheelDelta != "undefined") 
		delta=e.wheelDelta / 360.;
	    else delta = e.detail/ -9.;
	    var z=Math.pow(1.1, delta);
	    zoom(e.clientX-$("#team1").width(),e.clientY-$("nav").height(),z);
	});

	$("#svgout").mousedown(function(event) { dragstart(event);});
	$("#svgout").mousemove(function(e) {dragmove(e);});
	$("#svgout").mouseup(function(e) {dragstop(e);});

	jwerty.key("escape", nextphase);

	/* By-passes */
	jwerty.key("alt+p",function() {
	    activeunit.showpositions(activeunit.getdial());
	},{});
	jwerty.key("alt+g",function() {
	    if (TEAMS[activeunit.team].isia) activeunit.showgrouppositions();
	    else console.log("not an IA");
	},{});
	jwerty.key("alt+m",function() {
	    activeunit.showmeanposition();
	});
	jwerty.key("alt+shift+p",function() {
	    $(".possible").remove();
	});
	jwerty.key("alt+1", function() { activeunit.addfocustoken();activeunit.show();});
	jwerty.key("alt+2", function() { activeunit.addevadetoken();activeunit.show();});
	jwerty.key("alt+3", function() { if (!activeunit.iscloaked) {activeunit.addcloaktoken();activeunit.show();}});
	jwerty.key("alt+4", function() { activeunit.addstress();activeunit.show();});
	jwerty.key("alt+5", function() { activeunit.addiontoken();activeunit.show();});
	jwerty.key("alt+6", function() { activeunit.addtractorbeamtoken();activeunit.show();});
	jwerty.key("alt+shift+1", function() { if (activeunit.focus>0) activeunit.removefocustoken();activeunit.show();});
	jwerty.key("alt+shift+2", function() { if (activeunit.evade>0) activeunit.removeevadetoken();activeunit.show();});
	jwerty.key("alt+shift+3", function() { if (activeunit.iscloaked) {activeunit.removecloaktoken();activeunit.show();}});
	jwerty.key("alt+shift+4", function() { if (activeunit.stress>0) activeunit.removestresstoken();activeunit.show();});
	jwerty.key("alt+shift+5", function() { if (activeunit.ionized>0) activeunit.removeiontoken();});
	jwerty.key("alt+shift+6", function() { if (activeunit.tractorbeam>0) activeunit.removetractorbeamtoken();});
	jwerty.key("alt+d",function() { activeunit.resolvehit(1);});
	jwerty.key("alt+c",function() { activeunit.resolvecritical(1);});
	jwerty.key("alt+shift+d",function() { 
	    if (activeunit.hull<activeunit.ship.hull) activeunit.addhull(1); 
	    else if (activeunit.shield<activeunit.ship.shield) activeunit.addshield(1); 
	    activeunit.show();
	});

	if (SETUP.asteroids>0) {
	    loadrock(s,ROCKDATA);
	}

	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".unit").css("cursor","move");
	$("#positiondial").show();
	$(".permalink").show();
	$("#savebtn").hide();
	if (cannotreplay!=true) startreplayall();
	else for (i in squadron) {
	    /* TODO: bug to correct */
	    squadron[i].beginsetupphase();
	}
	break;
    case PLANNING_PHASE: 
	active=0;
	/* For actions of all ships */
	actionr = [$.Deferred().resolve()];
	/* For phase */
	actionrlock=$.Deferred().resolve();
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").addClass("disabled");
	$("#maneuverdial").show();
	skillturn=0;
	filltabskill();
	$("#savebtn").show();
	for (i in squadron) {
	    squadron[i].newm=squadron[i].m;
	    squadron[i].beginplanningphase().progress(nextplanning);
	}
	nextplanning();
	break;
    case ACTIVATION_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$(".nextphase").addClass("disabled");
	$("#activationdial").show();
	for (i in squadron) squadron[i].beginactivationphase().done(nextdecloak);
	
	filltabskill();
	subphase=DECLOAK_PHASE;
	skillturn=0;
	barrier(nextdecloak);
	break;
    case COMBAT_PHASE:
	log("<div>["+UI_translation["turn #"]+round+"]"+UI_translation["phase"+phase]+"</div>");
	$("#attackdial").show();
	skillturn=12;
	$(".nextphase").addClass("disabled");

	for (i in squadron) squadron[i].begincombatphase().done(nextcombat);
	barrier(nextcombat);
	break;
    }
}
function barrier(f) {
    //for (var i=0; i<actionr.length; i++) 
    //	log(i+":"+actionr[i].state());
    $.when.apply(null,actionr).done(f);
}
function log(str) {
    $("#log").append("<div>"+str+"<div>");
    $("#log").scrollTop(10000);
}
function permalink(reset) {
    var r="";
    if (!reset) { /*if (REPLAY!="") r=REPLAY; else*/ r=ANIM; } 
    return LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+SETUP.name+"&"+r+"&"+SCENARIOTITLE+"&"+HEADER);
}
function savesquad() {
    return LZString.compressToEncodedURIComponent(TEAMS[3].toASCII()+"&&");
}
function resetlink(home,setup,round) {
    switch (phase) {
    case SETUP_PHASE:
    case SELECT_PHASE: 
	document.location.search="";
	var uri=document.location.href;
	if (uri.indexOf("?") > 0) {
	    var clean_uri = uri.substring(0, uri.indexOf("?"));
	    window.history.replaceState({}, document.title, clean_uri);
	}
	location.reload();
	break;
    default: 
	if (home==true) {
	    if (document.location.search!="") document.location.search="";
	    else document.location.reload();
	} else {
	    if (setup==true) ANIM="";
	    else if (round==true) {
		$("#turnselector option:selected").each(function() {
		    var r=$(this).val();
		    if (r==-1) return;
		    if (r==0) ANIM=""; else {
			var idx=ANIM.search('_-P-'+r+'-3');
			ANIM=ANIM.slice(0,ANIM.indexOf("_",idx+1));
		    }
		});
	    } else {
		var idx=ANIM.search('_-P-'+round+'-3');
		if (ANIM.indexOf("_",idx+1)==-1) {
		    idx=ANIM.search('_-P-'+(round-1)+'-3');
		}
		ANIM=ANIM.slice(0,ANIM.indexOf("_",idx+1));
	    }	
	    var arg=LZString.decompressFromEncodedURIComponent(decodeURI(PERMALINK));
	    args=arg.split("&");
	    args[2]=saverock();
	    args[6]=ANIM;
	    args[7]=SCENARIOTITLE;
	    args[8]=HEADER;
	    arg=args.join("&");
	    document.location.search="?"+LZString.compressToEncodedURIComponent(arg);
	}
    }
}

function record(id,val,str) {
    //HISTORY.push({s:str,v:val,id:id});
    //log("<div style='background-color:red;color:white'>"+id+"."+str+":"+val+"<div>");
}
function history_toASCII() {
    var str="";
    for (var i=0; i<HISTORY.length; i++) 
	str+=HISTORY[i].s+"_"+HISTORY[i].id+";"
    return str;
}
function select(id) {
    var i;
    for (i in squadron) {
	if (squadron[i].id==id) break;
    }
    squadron[i].select();
    //$("#"+u.id).attr({color:"black",background:"white"});
    $("#"+activeunit.id).attr({color:"white",background:"tomato"});
}


function probatable(attacker,defender) {
    var i,j;
    var str="";
    for (i=0; i<=5; i++) {
	str+="<tr><td>"+i+"</td>";
	for (j=0; j<=5; j++) {
	    var k=j;
	    if (defender.adddice>0) k+=defender.adddice;
	    var th=tohitproba(attacker,{},defender,ATTACK[i],DEFENSE[k],i,k);
	    str+="<td class='probacell' style='background:hsl("+(1.2*(100-th.tohit))+",100%,80%)'>";
	    str+="<div>"+th.tohit+"%</div><div><code class='symbols'>d</code>"+th.meanhit+"</div><div><code class='symbols'>c</code>"+th.meancritical+"</div></td>";
	}
	str+="</tr>";
    }
    return str;
}
function fillprobatable() {
    var attacker={focus:$("#focusA").prop("checked")?1:0,
		  reroll:$("#targetA").prop("checked")?5:0};
    var defender={focus:$("#focusD").prop("checked")?1:0,
		  evade:$("#evadeD").prop("checked")?1:0,
		  adddice:$("#cloakD").prop("checked")?2:0,
		  reroll:0}
    //log("REROLL1:"+attacker.reroll);
    var ra;
    ra=parseInt($("#rerollA").val(),10);
    var rd=parseInt($("#rerollD").val(),10);
    //log("REROLL2:"+ra+"-"+$("#rerollA").val());
    if (attacker.reroll==0||(ra>0&&ra<attacker.reroll)) attacker.reroll=ra;
    if (defender.reroll==0||(rd>0&&rd<defender.reroll)) defender.reroll=rd;

    //log("REROLL "+ra);
    var str="<tr><th>Rolls</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>"+probatable(attacker,defender);
    $("#probatable").html(str);
}


function modal_dragstart(event) {
    var style = window.getComputedStyle(event.originalEvent.target, null);
    event.originalEvent.dataTransfer.setData("text/plain",
					     event.target.parentElement.id+","+
					     (parseInt(style.getPropertyValue("left"),10) - event.originalEvent.clientX) + ',' +
					     (parseInt(style.getPropertyValue("top"),10) - event.originalEvent.clientY));
} 
function modal_dragover(event) { 
    event.originalEvent.preventDefault(); 
    return false; 
} 
function modal_drop(event) { 
    var offset = event.originalEvent.dataTransfer.getData("text/plain").split(',');
    var id = offset[0];
    $("#"+id+" > div").css("left", (event.originalEvent.clientX + parseInt(offset[1],10)) + 'px');
    $("#"+id+" > div").css("top", (event.originalEvent.clientY + parseInt(offset[2],10)) + 'px');
    event.originalEvent.preventDefault();
    return false;
} 
var viewport_translate=function(dx,dy) {
    VIEWPORT.m=MT(dx,dy).add(VIEWPORT.m);
    $(".phasepanel").hide();
    VIEWPORT.transform(VIEWPORT.m);
}
    var viewport_zoom=function(z) {
	var w=$("#svgout").width();
	var h=$("#svgout").height();
	var offsetX=activeunit.m.x(0,0);
	var offsetY=activeunit.m.y(0,0);
	var vm=VIEWPORT.m.clone().invert();
	var x=vm.x(offsetX,offsetY);
	var y=vm.y(offsetX,offsetY);

	VIEWPORT.m.translate(x,y).scale(z).translate(-x,-y);
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    }
	var dragmove=function(event) {
	    if (activeunit.dragged==true) return;
	    var e = event; // old IE support
	    var x=e.offsetX,y=e.offsetY;
	    if (VIEWPORT.dragged) {
		var w=$("#svgout").width();
		var h=$("#svgout").height();
		var max=Math.max(900./w,900./h);
		var ddx=(e.offsetX-VIEWPORT.x0)*max;
		var ddy=(e.offsetY-VIEWPORT.y0)*max;
		VIEWPORT.dragMatrix=MT(ddx,ddy).add(VIEWPORT.m);
		VIEWPORT.dragged=true;
		$(".phasepanel").hide();
		VIEWPORT.transform(VIEWPORT.dragMatrix);
	    }
	}
var dragstart=function(event) { 
    var e = event; // old IE support
    VIEWPORT.dragged=true;
    if (e.originalEvent.target.id == "svgout") {
	VIEWPORT.x0=e.offsetX;
	VIEWPORT.y0=e.offsetY;
	VIEWPORT.dragged=true; 
	VIEWPORT.dragMatrix=VIEWPORT.m;
    } else VIEWPORT.dragged=false;
}
var   dragstop= function(e) { 
    if (VIEWPORT.dragged) { 
	VIEWPORT.m=VIEWPORT.dragMatrix;
	VIEWPORT.m.clone();
	VIEWPORT.transform(VIEWPORT.m);
	activeunit.show();
    }
    VIEWPORT.dragged=false;
}
var scrolloverflow=function(event) {
    var id=event.target.id;
    $("#"+id+" .outoverflow").each(function(index) { 
	if ($(this).css("top")!="auto") {
	    $(this).css("top",$(this).parent().offset().top+"px");
	}
    });
}

var changelanguage= function(l) {
    localStorage['LANG']=l;
    //log("reloading "+l);
    location.reload();
}
$(document).ready(function() {
    var i;
    s= Snap("#svgout");

    VIEWPORT = s.g().attr({id:"viewport"});
    VIEWPORT.m=new Snap.Matrix();
    FILTER = s.filter(Snap.filter.blur(5,5));
    P = { F0:{path:s.path("M 0 0 L 0 0"), speed: 0, key:"5"},
	  F1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"8"},
	  RF1:{path:s.path("M 0 0 L 0 -80"), speed: 1, key:"|"},
	  F2:{path:s.path("M 0 0 L 0 -120"), speed: 2, key:"8"},
	  F3:{path:s.path("M 0 0 L 0 -160"), speed: 3, key:"8"},
	  F4:{path:s.path("M 0 0 L 0 -200"), speed: 4, key:"8"},
	  F5:{path:s.path("M 0 0 L 0 -240"), speed: 5, key: "8" },
	  // Turn right
	  TR1:{path:s.path("M0 0 C 0 -40 15 -55 55 -55"), speed: 1, key:"6"},// 35 -35
	  TR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83"), speed:2, key:"6"},// 63 -63
	  TRR2:{path:s.path("M0 0 C 0 -50 33 -83 83 -83"), speed:2, key:";"},// 63 -63
	  TR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105"), speed:3, key:"6"}, // 85 -85
	  TRR3:{path:s.path("M0 0 C 0 -60 45 -105 105 -105"), speed:3, key:";"}, // 85 -85
	  // Turn left
	  TL1:{path:s.path("M0 0 C 0 -40 -15 -55 -55 -55"), speed:1, key:"4"}, // -35 -35
	  TL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83"), speed:2, key:"4"},// -63 -63
	  TRL2:{path:s.path("M0 0 C 0 -50 -33 -83 -83 -83"), speed:2, key:":"},// -63 -63
	  TL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105"), speed:3, key:"4"}, // -85 -85
	  TRL3:{path:s.path("M0 0 C 0 -60 -45 -105 -105 -105"), speed:3, key:":"}, // -85 -85
	  // Bank right
	  BR1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92"), speed:1, key:"9"}, // 24 -58 (+/-14.14)
	  RL1:{path:s.path("M0 0 C 0 -20 18 -72 38 -92"), speed:1, key:"}"}, // 24 -58 (+/-14.14)
	  BR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"9"}, // 40 -92 (+/-14.14)
	  SR2:{path:s.path("M0 0 C 0 -30 24 -96 54 -126"), speed:2, key:"3"}, // 40 -92 (+/-14.14)
	  BR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"9"}, // 55 -126 (+/-14.14)
	  SR3:{path:s.path("M0 0 C 0 -40 29 -120 69 -160"), speed:3, key:"3"}, // 55 -126 (+/-14.14)
	  // Bank left
	  BL1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"7"}, // 24 -58 (+/-14.14)
	  RR1:{path:s.path("M0 0 C 0 -20 -18 -72 -38 -92"), speed:1, key:"{"}, // 24 -58 (+/-14.14)
	  BL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"7"}, // 40 -92 (+/-14.14)
	  SL2:{path:s.path("M0 0 C 0 -30 -24 -96 -54 -126"), speed:2, key:"1"}, // 40 -92 (+/-14.14)
	  BL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"7"}, // 55 -126 (+/-14.14)
	  SL3:{path:s.path("M0 0 C 0 -40 -29 -120 -69 -160"), speed:3, key:"1"}, // 55 -126 (+/-14.14)
	  // K turns (similar to straight line, special treatment in move function)
	  K1:{path:s.path("M 0 0 L 0 -80"), speed:1, key:"2"},
	  K2:{path:s.path("M 0 0 L 0 -120"), speed:2, key:"2"},
	  K3:{path:s.path("M 0 0 L 0 -160"), speed:3, key:"2"},
	  K4:{path:s.path("M 0 0 L 0 -200"), speed:4, key:"2"},
	  K5:{path:s.path("M 0 0 L 0 -240"), speed:5, key: "2" }
	};
    for (i in P)
	P[i].path.attr({display:"none"});
    $(".menu").mouseover(function() {
	$(".menu ul").css({display:'block',visibility:'visible'})
    }).mouseout(function() {
	$('nav ul').css({display:'none',visibility:'hidden'})
    });
    $("footer").hide();

    var initgapi=function() {
        gapi.client.setApiKey('AIzaSyBN2T9d2ZuWaT0Vj6EanYb5IgWzLlhy7Zo');
        gapi.client.load('urlshortener', 'v1');
    }
    if (typeof gapi!="undefined") gapi.load('client', initgapi);

    $("#squad1").on("paste",function() {
	setTimeout(function(){
	    currentteam=TEAMS[1];importsquad(1);}, 4)
    });
    $("#squad2").on("paste",function() {
	setTimeout(function(){
	    currentteam=TEAMS[2];importsquad(2);}, 4)
    });


    /*
    jwerty.key("alt+i",function() {
	hello('google').login()
    });
    jwerty.key("alt+j",function() {
	hello('facebook').login()
    });
    hello.on('auth.login', function(auth) {
	// Call user information, for the given network
	hello(auth.network).api('me').then(function(r) {
	    // Inject it into the container
	    console.log(r.thumbnail+" hello "+r.name);
	});
    });
    hello.init({
	facebook: "1615235965440706",
	windows: "",
	google: "896425822430-lv5gd4lk9c88hc47cp5eeigsb1h8rbio.apps.googleusercontent.com"
    }, {redirect_uri: 'http://xws-bench.github.io/bench/index.html'});
    */    
    /*hello('facebook').api('me').then(function(r) {
	console.log("my name is (facebook) "+r.name);
    });
    hello('google').api('me').then(function(r) {
	console.log("my name is (google) "+r.name);
    });
*/
    // Load unit data
    var availlanguages=["en","fr","de","es","it","pl"];
    LANG = localStorage['LANG'] || window.navigator.userLanguage || window.navigator.language;
    LANG=LANG.substring(0,2);
    $.ajaxSetup({
	beforeSend: function(xhr){
	    if (xhr.overrideMimeType) xhr.overrideMimeType("application/json");
	},
	isLocal:true
    });
    if (availlanguages.indexOf(LANG)==-1) LANG="en";
    $("#langselect").val(LANG);
    $.when(
	$.ajax("data/ships.json",{error:function(xhr,status,error) {
	    console.log("**Error loading ships.json\n"+status+" "+error);
	}}),
	$.ajax("data/strings."+LANG+".json",{error:function(xhr,status,error) {
	    console.log("**Error loading strings."+LANG+".json\n"+status+" "+error);
	}}),
	$.ajax("data/xws.json",{error:function(xhr,status,error) {
	    console.log("**Error loading xws.json\n"+status+" "+error);
	}}),
	$.ajax("data/strings.en.json",{error:function(xhr,status,error) {
	    console.log("**Error loading strings."+LANG+".json\n"+status+" "+error);
	}}),
	$.ajax("data/ratings.json",{error:function(xhr,status,error) {
	    console.log("**Error loading ratings.json\n"+status+" "+error);
	}}),
	$.ajax("data/full4b.json",{error:function(xhr,status,error) {
	    console.log("**Error loading full4b.json\n"+status+" "+error);
	}})
    ).done(function(result1,result2,result3,r4,r5,r6) {
	var process=setInterval(function() {
	    ATTACK[dice]=attackproba(dice);
	    DEFENSE[dice]=defenseproba(dice);
	    dice++;
	    if (dice==8) {
		fillprobatable();
		$("#showproba").prop("disabled",false);
		clearInterval(process);}
	},500);
	unitlist=result1[0];
	ENSHIP_translation=r4[0].ships;
	ENPILOT_translation=r4[0].pilots;
	ENUPGRADE_translation=r4[0].upgrades;
	SHIP_translation=result2[0].ships;
	PILOT_translation=result2[0].pilots;
	UPGRADE_translation=result2[0].upgrades;
	RATINGS_upgrades=r5[0].upgrades;
	RATINGS_ships=r5[0].ships;
	RATINGS_pilots=r5[0].pilots;
	TOP_squads=r6[0].data;
	UI_translation=result2[0].ui;
	CRIT_translation=result2[0].criticals;
	var css_translation=result2[0].css;
	var str="";

	if (LANG!="en") {
	    for (i in ENUPGRADE_translation) {
		var u=ENUPGRADE_translation[i];
		var v=UPGRADE_translation[i];
		var t=u.text;
		if (typeof v=="undefined") UPGRADE_translation[i]=u;
	    }
	    for (i in ENPILOT_translation) {
		var u=ENPILOT_translation[i];
		var v=PILOT_translation[i];
		var t=u.text;
		if (typeof v=="undefined") {
		    PILOT_translation[i]=u;
		}
	    }
	}

	for (var i in css_translation) {
	    str+="."+i+"::after { content:\""+css_translation[i]+"\";}\n";
	}
	$("#localstrings").html(str);

	UPGRADE_dict=result3[0].upgrades;
	PILOT_dict=result3[0].pilots;

	for (var j in PILOT_dict) {
	    for (var i=0; i<PILOTS.length; i++) 
		if (PILOTS[i].name==PILOT_dict[j]) PILOTS[i].dict=j;
	    for (var i in unitlist) 
		if (i==PILOT_dict[j]) unitlist[i].dict=j;
	}
	for (i=0; i<UPGRADES.length; i++) {
	    var u=UPGRADES[i];
	    if (u.type==TITLE) {
		unitlist[u.ship].hastitle=true;
	    }
	}

	/*Sanity check */
	
	for (var i=0; i<PILOTS.length; i++) {
	    var found=false;
	    for (var j in PILOT_dict) 
		if (PILOTS[i].name==PILOT_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+PILOTS[i].name);
	}
	for (var i=0; i<UPGRADES.length; i++) {
	    var found=false;
	    for (var j in UPGRADE_dict) 
		if (UPGRADES[i].name==UPGRADE_dict[j]) { found=true; break; }
	    if (!found) log("no xws translation for "+UPGRADES[i].name);
	}

	var r=0,e=0,i;
	squadron=[];

	s.attr({width:"100%",height:"100%",viewBox:"0 0 900 900"});
	//TEAMS[1].selectrocks();
	//TEAMS[2].selectrocks();
	/*UPGRADES.sort(function(a,b) {
	    var an=a.name;
	    var bn=b.name;
	    if (typeof UI_translation[an]!="undefined"&&typeof UI_translation[an].name!="undefined") an=UI_translation[a.name].name;
	    if (typeof UI_translation[bn]!="undefined"&&typeof UI_translation[bn].name!="undefined") bn=UI_translation[b.name].name;
	    var u1=an+a.type;
	    var u2=bn+b.name;
	    return u1.localeCompare(u2);
	});
	PILOTS.sort(function(a,b) { 
		var d=a.points-b.points;
		if (d==0) return a.name.localeCompare(b.name);
		else return d;
	    });*/	

	var n=0,u=0,ut=0,ntot=0;
	var str="";
	for (i=0; i<PILOTS.length; i++) {
	    if (PILOTS[i].done==true) { if (PILOTS[i].unique) u++; n++; }
	    if (!PILOTS[i].done) { 
		if (PILOTS[i].unique) str+=", ."; else str+=", ";
		str+=PILOTS[i].name; 
	    }
	}
	console.log(n+"/"+PILOTS.length+" pilots with full effect");
	$(".motd").append(n+"/"+PILOTS.length+" pilots with full effect<br/>");
	if (str!="") $(".motd").append("Pilots NOT working yet:"+str+"<br/>");
	n=0;
	str="";
	for (i=0; i<UPGRADES.length; i++) {
	    if (UPGRADES[i].invisible) continue; 
	    if (UPGRADES[i].done==true) n++;
	    else str+=(str==""?"":", ")+(UPGRADES[i].unique?".":"")+UPGRADES[i].name;
	    ntot++;
	}
	$(".ver").html(VERSION);
	console.log(n+"/"+ntot+" upgrades with full effect");
	$(".motd").append(n+"/"+ntot+" upgrades with full effect<br/>");
	if (str!="") $(".motd").append("Upgrades NOT working yet:"+str+"<br/>");
	$("#showproba").prop("disabled",true);
	var d=new Date();


	if (typeof localStorage.volume=="undefined") localStorage.volume=0.8;
	if (typeof localStorage.image!="undefined") $("#profile-avatar").attr("src",localStorage.image);
	if (typeof localStorage.name!="undefined") $("#nameinput").val(localStorage.name); else $("#nameinput").val("Player");

	//Howler.volume(localStorage.volume);
	//$("#vol").val(localStorage.volume*100);

	var mc= new Hammer(document.getElementById('svgout'));
	mc.get("pinch").set({enable:true});
	mc.get('pan').set({direction:Hammer.DIRECTION_ALL});
	mc.on("panleft panright panup pandown",function(ev) {
	    if (ev.target.id!="svgout") return;
	    if (activeunit.dragged==true) return;
	    viewport_translate(ev.velocityX*50,ev.velocityY*50);
	});
	var tmpl = ["unit-creation","combat-display","unit-printable","unit-combat","upglist-creation","faction","usabletokens","selectweapon"];
	for (i in tmpl) {
	    TEMPLATES[tmpl[i]]=$("#"+tmpl[i]).html();
	    Mustache.parse(TEMPLATES[tmpl[i]]);  
	}

	$('body').on('mousedown', 'footer', function() {
            $(this).addClass('draggable').parents().on('mousemove', function(e) {
		$('.draggable').offset({
                    top: e.pageY - $('.draggable').outerHeight() / 2,
                    left: e.pageX - $('.draggable').outerWidth() / 2
		}).on('mouseup', function() {
                    $(this).removeClass('draggable');
		});
            });
            if (typeof e.preventDefault=="function") e.preventDefault();
	}).on("mouseup",function() {
	    $(".draggable").removeClass("draggable");
	});

	mc.zoom=1;
	mc.on("pinch",function(ev) {
	    if (ev.target.id!="svgout") { return;}
	    if (activeunit.dragged==true) return;
	    var vm=VIEWPORT.m.clone().invert();
	    var x=vm.x(ev.center.x,ev.center.y);
	    var y=vm.y(ev.center.x,ev.center.y);
	    VIEWPORT.m.translate(x,y).scale(ev.scale).scale(1/mc.zoom).translate(-x,-y);
	    mc.zoom=ev.scale;
	    VIEWPORT.transform(VIEWPORT.m);
	    activeunit.show();
	    if (ev.final) mc.zoom=1;
	});
	$("aside").on("scroll touchmove touchstart mousewheel", scrolloverflow);

	scenariomode(FREECOMBAT);	

	var arg=LZString.decompressFromEncodedURIComponent(decodeURI(window.location.search.substr(1)));
	var args=[];
	if (arg!=null) args= arg.split('&');
	console.log("ARGS LENGTH="+args.length);
	if (args.length>1) {
	    log("Loading permalink...");
	    ROCKDATA=args[2];
	    //phase=CREATION_PHASE;
	    TEAMS[1].parseASCII(args[0]);
	    TEAMS[1].toJSON(); // Just for points
	    if (args[1]=="") {
		TEAMS[3].parseASCII(args[0]);
		currentteam=TEAMS[3];
		currentteam.team=3;
		console.log(currentteam.toJuggler(false));
		createsquad(currentteam.faction);
		for (var j in generics) {
		    var u=generics[j];
		    if (u.team==3) {
			for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
		    }
		}
		console.log("##"+args[0]);
		console.log(currentteam.toJuggler(false));
		document.location="#creation";
	    } else {
		TEAMS[2].parseASCII(args[1]);
		TEAMS[2].toJSON(); // Just for points
		TEAMS[1].isia=false;
		TEAMS[2].isia=false;
		//console.log("player name and image:"+args[8]+"<>"+args[7]+"<>");
		if (args[3]=="true") TEAMS[1].isia=true;	
		else { 
		    //localStorage["playername"]=args[8];
		}
		if (args[4]=="true") TEAMS[2].isia=true;
		else { 
		    //localStorage["playername"]=args[8];
		}
		setSetup(args[5]);
		console.log("SETUP loaded:"+args[5]);
		phase=SELECT_PHASE;
		HEADERS="";SCENARIOTITLE="";
		if (args.length>6&args[6]!="") { REPLAY=args[6]; }
		if (args.length>8) { HEADER=args[8]; SCENARIOTITLE=args[7]; }
		PERMALINK=LZString.compressToEncodedURIComponent(TEAMS[1].toASCII()+"&"+TEAMS[2].toASCII()+"&"+saverock()+"&"+TEAMS[1].isia+"&"+TEAMS[2].isia+"&"+args[5]+"&&"+SCENARIOTITLE+"&"+HEADERS);
		return nextphase();
	    }
	}
	delete localStorage["imageplayer"];
	delete localStorage["playername"];
	phase=0;
	nextphase();
	
	setSetup("Classic");

	SQUADLIST = new Squadlist("#squadlist");
	SQUADLIST.user();
	SCENARIOLIST = new Scenariolist("#scenariolist");
	SCENARIOLIST.user();
	TEAMS[3].changefaction(REBEL);
	var pilots=[];
	for (i=0; i<PILOTS.length; i++) {
	    var n=i;
	    var name=translate(PILOTS[i].name);
	    if (PILOTS[i].ambiguous==true
		&&typeof PILOTS[i].edition!="undefined") 
		name+="("+PILOTS[i].edition+")";
	    pilots.push(name.replace(/\'/g,"").replace(/\(Scum\)/g,""));
	}
	var upgrades=[];
	for (i in UPGRADE_translation) {
	    upgrades.push(' '+translate(i).replace(/\'/g,"").replace(/\(Crew\)/g,""));
	}
	$(".squadbg > textarea").asuggest(pilots, { 'delimiters': '^\n', 'cycleOnTab': true });
	$(".squadbg > textarea").asuggest(upgrades, { 'delimiters': '+', 'cycleOnTab':true});
    });
});
function printunits() {
    var str="";
    var alltot=0;
    for (var i in generics) {
	var u=generics[i];
	if (u.team==currentteam.team) {
	    var tot=0;
	    for (var j in u.upgrades) {
		var upg=u.upgrades[j];
		if (typeof upg.points=="undefined") {
		    upg.points=u.points;
		    upg.name="Ship:"+u.ship.name;
		}
		tot+=parseInt(upg.points,10);
	    }
	    u.totpoints=tot;
	    alltot+=tot;
	    str+=Mustache.render(TEMPLATES["unit-printable"],u);
	}
    }
    $("#factionname").addClass(currentteam.faction.toUpperCase());
    $("#pointsname").html(alltot);
    $("#printunits").html(str);
}

function Squadlist(id) {
    this.id=id;
    TEMPLATES["row-manage"]=$("#row-manage").html();
    Mustache.parse(TEMPLATES["row-manage"]);  
    TEMPLATES["header-manage"]=$("#header-manage").html();
    Mustache.parse(TEMPLATES["header-manage"]);  
    
    $(id).html(Mustache.render(TEMPLATES["header-manage"],{translation:UI_translation["type"]}));
    var self=this;

    $(id+" tbody").on( 'click', 'tr', function () {
        $(id+" .selected").removeClass('selected');
        $(this).addClass('selected');
    } );
}


Squadlist.prototype = {
    isinrow: function(t) {
	return ((typeof this.rows!="undefined")&&(this.rows.indexOf(t)>-1)); 
    },
    filter: function(f) {
	console.log("matching with "+f);
	for (var i in this.rows) {
	    if (!this.rows[i].match(f)) {
		$("#r-"+i).hide();
	    }
	    else {
		$("#r-"+i).show();
		console.log("showing row "+i+" "+this.rows[i]);
	    }
	}

    },
    addrow: function(team,name,pts,faction,jug,fill,isselection) {
	if (isselection!=true) enablenextphase();
	var n=faction.toUpperCase();
	if (typeof localStorage[name]=="undefined"||fill==true) {
	    this.rows[this.nrows]=jug;
	    $(this.id +" tbody").append(
		Mustache.render(TEMPLATES["row-manage"],{
		    nrows:this.nrows,
		    faction:n,
		    pts:pts,
		    name:name,
		    jug:jug//.replace(/\n/g,"<br>")
		}));
	    this.nrows++;
	}
    },
    removerow:function(t) {
	var row = this.table.row(t.parents("tr"));
	var data = row.data()[4];
	delete localStorage[data];
	row.remove().draw(false);
    },
    createfromrow:function(t) {
	var data = this.rows[t];
	currentteam=TEAMS[3];
	currentteam.parseJuggler(data,true);
	//console.log("data is "+data);
	createsquad(currentteam.faction);
	for (var j in generics) {
	    var u=generics[j];
	    if (u.team==3) {
		for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
	    }
	}

	document.location="#creation";
	//displayfactionunits(true);
    },
    toplist: function() {
	var i;
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (i=0; i< TOP_squads.length; i++) {
	    TEAMS[0].parseJuggler(TOP_squads[i],false); 
	    if (LANG!="en")
		this.addrow(0,i,TEAMS[0].points,TEAMS[0].faction,TEAMS[0].toJuggler(true),true); 
	    else
		this.addrow(0,i,TEAMS[0].points,TEAMS[0].faction,TEAMS[0].toJuggler(false),true);
	}
    },
    user: function() {
	var i;
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (i in localStorage) {
	    if (typeof localStorage[i]=="string"&&i.match(/SQUAD.*/)) {
		//delete localStorage[i];
		
		var l=$.parseJSON(localStorage[i]);
		if (typeof l.jug=="undefined"||typeof l.pts=="undefined"||typeof l.faction=="undefined")
		    delete localStorage[i]
		else {
		    if (LANG!="en") { 
			TEAMS[0].parseJuggler(l.jug,false); 
			this.addrow(0,i,l.pts,l.faction,TEAMS[0].toJuggler(true),true); 
		    } else {
			this.addrow(0,i,l.pts,l.faction,l.jug,true);
		    }
		}
	    }
	}
    },
    latest: function() {
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (var i=0; i<mySpreadsheets.length; i++) {
	    $('#squadlist').sheetrock({
		url: mySpreadsheets[i],
		query:"select C order by A desc",
		//callback:myCallbacksl,
		fetchSize:40,
		rowTemplate:this.myTemplatesl,//function () { return "";},
	    });
	}  
    },
    myTemplatesl: function(o) { 
	var cells= o.cellsArray;
	var s="";
	var squad=cells[0];
	var tt=squad.split("VS");
	if (tt.length<2) return;
	var team1=mk2split(tt[0]);
	var team2=mk2split(tt[1]);
	var t1="",s1="",t2="",s2="";

	for (var j=0; j<team1.length-1; j++) {
	    s1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    t1+=team1[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	}
	for (var j=0; j<team2.length-1; j++) {
	    s2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	    t2+=team2[j].replace(/\*/g," + ").replace(/_/g," ")+"\n";
	}
	TEAMS[0].parseJuggler(s1,false);
	TEAMS[0].toJSON();
	if (typeof SQUADLIST.log[t1]=="undefined") {
	    SQUADLIST.addrow(0,"SQUAD."+TEAMS[0].toASCII(),TEAMS[0].points,TEAMS[0].faction,t1,true);
	    SQUADLIST.log[t1]=true;
	}
	TEAMS[0].parseJuggler(s2,false);
	TEAMS[0].toJSON();
	if (typeof SQUADLIST.log[t2]=="undefined") {
	    SQUADLIST.addrow(0,"SQUAD."+TEAMS[0].toASCII(),TEAMS[0].points,TEAMS[0].faction,t2,true);
	    SQUADLIST.log[t2]=true;
	}

    },
    displaycombats: function(data) {
	generics=[];
	squadron=[];
	if (typeof data!="undefined") { 
	    var d=this.rows[data];
	    TEAMS[0].parseJuggler(d,true);
	    var team=TEAMS[0].toJuggler(false);
	    team=team.replace(/\n/g,".");
	    team=team.replace(/ \+ /g,"*");
	    //t=t.replace(/-/g,"\\-");
	    team=team.replace(/ /g,"_");
	    SEARCHINGSQUAD=team;
	}
	stype="";
	var t=SEARCHINGSQUAD;
	$("#replay").attr("src","space.html");

	/*
	  if (LANG!="en") {
	  TEAMS[0].parseJuggler(s1,false);
	  s1=TEAMS[0].toJuggler(true);
	  }*/
	/*ga('send','event', {
	    eventCategory: 'interaction',
	    eventAction: 'battlelog',
	    eventLabel: 'battlelog',
	    eventValue:response.rows.length
	});*/

	for (var i=0; i<mySpreadsheets.length; i++) {
	    $('#squadbattlediv').sheetrock({
		url: mySpreadsheets[i],
		/* score: B, squad:C, E and A: url */
		query:"select B,C,E,A where C contains '"+t+"'",
		/*callback:myCallback,*/
		fetchSize:2,
		rowTemplate:myTemplate
	    });
	}   
    },
    printfromrow: function(t) {
	var data = this.rows[t];
	generics=[];
	squadron=[];
	TEAMS[0].parseJuggler(data,true);
	currentteam = TEAMS[0];
	for (var i in generics) {
	    var u=generics[i];
	    if (u.team==0) {
		addunit(u.pilotid,currentteam.faction,u);
		for (var j=0; j<u.upgradetype.length; j++) {
		    var upg=u.upg[j];
		    if (upg>-1) {
			addupgrade(u,upg,j);
		    }
		}
	    }
	}
	printunits();
	window.print();
    },
    checkrow:function(n,t) {
	prepareforcombat(this.rows[t],n);
    }
}
function displayfactionunits(noreset) {
    var count=0;
    var n=0;
    var i,j,k;
    var faction=TEAMS[3].faction;
    var p={};
    var t={};
    var uu=[];
    currentteam=TEAMS[3];
    //if (phase!=CREATION_PHASE) return;

    if (faction=="REBEL") {
	$(".dialfilter td[move=SL3]").text(P["TRL3"].key).attr("move","TRL3"); 
	$(".dialfilter td[move=SL2]").text(P["TRL2"].key).attr("move","TRL2"); 
    } else  {
	$(".dialfilter td[move=TRL3]").text(P["SL3"].key).attr("move","SL3");
	$(".dialfilter td[move=TRL2]").text(P["SL2"].key).attr("move","SL2");
    }
    for (i in unitlist) if (unitlist[i].faction.indexOf(faction)>-1) count++;

    //var tz = Math.round( ( 186 / 2 ) / Math.tan( Math.PI / count ) );
    if (noreset==true) $("#caroussel").html(""); else $(".caroussel").html("");
    //increment = 360. / count;
    var str;
    for (i=0; i<PILOTS.length; i++) {
	var u=PILOTS[i].unit;
	var rating="";
	var name=PILOTS[i].name;
	if (PILOTS[i].faction==faction) {
	    if (typeof p[u]=="undefined") p[u]=[];
	    /* should go elsewhere */
	    if (PILOTS[i].upgrades.indexOf(ELITE)>-1) PILOTS[i].haselite=true;
	    var text=getpilottexttranslation(PILOTS[i],faction);
	    if (text!="")
		text+=(PILOTS[i].done==true?"":"<div><strong class='m-notimplemented'></strong></div>");
	    if (PILOTS[i].faction==SCUM) name+="(SCUM)";
	    if (typeof PILOTS[i].edition!="undefined") name+=" ("+PILOTS[i].edition+")";
	    if (typeof RATINGS_pilots[name]!="undefined") {
		text=text+"<hr/><p class='strategy'>"+RATINGS_pilots[name].text+"</p>";
		rating=repeat("ÿ",RATINGS_pilots[name].rating);
	    }
	    PILOTS[i].tooltip=text;
	    PILOTS[i].rating=rating;
	    PILOTS[i].trname=translate(PILOTS[i].name);
	    p[u].push(PILOTS[i]);
	    //PILOTS[i].pilotid=i;
	}
    }
    for (u in p) p[u].sort(function(a,b) { return a.points - b.points; });
    for (i in unitlist) 
	if (unitlist[i].faction.indexOf(faction)>-1) { 
	    unitlist[i].trname=SHIP_translation[i]; 
	    unitlist[i].name=i;
	    if (typeof unitlist[i].trname=="undefined") unitlist[i].trname=i;
	    uu.push(unitlist[i]);
	}
    uu.sort(function(a,b) { return a.trname > b.trname; });
    for (i=0; i<uu.length; i++) {
	str="";
	n++;
	var u=uu[i];
	var q=p[u.name];
	var filter=p[u.name][0].upgrades;
	var filtered=true;
	if (WAVEFILTER!="0") {
	    var qq=[];
	    for (k in q) {
		var v=q[k];
		if (typeof v.wave!="undefined") {
		    if (v.wave.indexOf(WAVEFILTER)>-1)		    
			qq.push(v);
		} else if (u.wave==WAVEFILTER)	qq.push(v);
	    }
	    if (qq.length==0) filtered=false;
	    q=qq;
	}
	for (j in UNITFILTER)
	    if (filter.indexOf(j)==-1) filtered=false;
	for (j in ACTIONFILTER) 
	    if (u.actionList.indexOf(j)==-1) filtered=false;
	if (COSTFILTER>0) {
	    var qq=[];
	    for (k in q) {
		var v=q[k];
		if (v.points<=COSTFILTER) qq.push(v);
	    }
	    if (qq.length==0) filtered=false;
	    q=qq;
	}
	if (TEXTFILTER!=""&&filtered==true) {
	    var qq=[];
	    for (k in q) {
		var v=q[k];
		//console.log("v:"+v.unitfaction);
		//console.log("unit faction "+v.name+" "+v.unitfaction);
		var ttext=getpilottexttranslation(v,faction);
		var tname=translate(v.name);
		var r=new RegExp(TEXTFILTER,'i');
		if (ttext.match(r)||tname.match(r)) qq.push(v);
	    }
	    if (qq.length==0) filtered=false;
	    q=qq;
	}
	for (j in MOVEFILTER) {
	    var found=false;
	    for (k=0; k<u.dial.length; k++)
		if (u.dial[k].move==j) found=true;
	    if (!found) filtered=false;
	}
	if (filtered) {
	    var rating = [];
	    /*var fname=u.name;
	    if (faction=="SCUM") fname=fname+" (SCUM)";
	    if (typeof RATINGS_ships[fname]!="undefined") rating=[RATINGS_ships[fname]];*/
	    var rendered=Mustache.render(TEMPLATES["faction"], {
		shipimg:u.img[0],
		fire:repeat('u',u.fire),
		evade:repeat('u',u.evade),
		hull:repeat('u',u.hull),
		shield:repeat('u',u.shield),
		diallist:dial2JSON(u.dial),
		shipname:u.trname,
		primary:u.weapon_type,
		faction:faction,
		//rating:rating,
		actionlist:function() {
		    var al=[];
		    for (j=0; j<u.actionList.length; j++) al[j]=A[u.actionList[j]].key;
		    return al;
		},
		hastitle:u.hastitle,
		shipupgrades:p[u.name][0].upgrades,
		pilots:q
	    });
	    $("#caroussel").append("<li>"+rendered+"</li>");	    
	}
    }
}
function addunique(name) {
    UNIQUE[name]=true;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) {
	    $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",true);
	}
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",true);
    }
}
function removeunique(name) {
    UNIQUE[name]=false;
    for (var i=0; i<PILOTS.length; i++) {
	if (name==PILOTS[i].name) $(".pilots button[pilotid="+PILOTS[i].pilotid+"]").prop("disabled",false);
    }
    for (var i=0; i<UPGRADES.length; i++) {
	if (name==UPGRADES[i].name) $(".upglist button[data="+i+"]").prop("disabled",false);
    }
}
function addlimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",true);
}
function removelimited(u,data) {
    $("#unit"+u.id+" .upglist button[data="+data+"]").prop("disabled",false);
}
function addupgradeaddhandler(u) {
    $("#unit"+u.id+" button.upgrades").click(function(e) {
	var org=e.currentTarget.getAttribute("class").split(" ")[1];
	var num=e.currentTarget./*parentElement.*/getAttribute("num");
	var p=this.getupgradelist(org);
	$("#unit"+this.id+" .upgs .upgavail").hide();
	$("#unit"+this.id+" .upgs .upg").hide();
	//$("#unit"+this.id+" .upglist").append("<tr><td></td><td colspan='3'><input class='textfilter' type='search'></td></tr>");

	if (typeof this.upgbonus[org]=="undefined") this.upgbonus[org]=0;

	var q=[];
	for (var i=0; i<p.length; i++) {
	    var upg=UPGRADES[p[i]];
	    var disabled;
	    var attacks=[];
	    if (upg.invisible) continue;
	    disabled=(UNIQUE[upg.name]==true)
		||((upg.limited==true||this.exclupg[upg.type]==true)&&$("#unit"+this.id+" .upg tr[data="+p[i]+"]").length>0);
	    var pts=upg.points+this.upgbonus[org];
	    if (upg.points>0&&pts<0) pts=0;
	    var text=formatstring(getupgtxttranslation(upg.name,upg.type));
	    if (upg.done!=true) text+="<div><strong class='m-notimplemented'></strong></div>";
	    if (typeof upg.attack!="undefined") attacks=[{attack:upg.attack,lrange:upg.range[0],hrange:upg.range[1]}];
	    //log(pts+" "+text+" disabled"+disabled+" num"+num+" data"+p[i]+" name"+translate(upg.name)+" attacks"+attacks[0].attack);
	    var rating=0;
	    var comment="";
	    var v=upg.name+(upg.type==CREW?"(Crew)":"");
	    if (typeof RATINGS_upgrades[v]!="undefined"
		&&typeof RATINGS_upgrades[v].rating!="undefined") {
		rating=RATINGS_upgrades[v].rating;
		comment=RATINGS_upgrades[v].text;
	    } else console.log("no rating for "+upg.name);
	    q.push({
		pts:pts,
		rating:repeat('ÿ',rating),
		tooltip:[text+"<hr/><p class='strategy'>"+comment+"</p>"],
		text:text,
		isdisabled:disabled,
		num:num,
		data:p[i],
		name:translate(upg.name).replace(/\(Crew\)/g,""),
		attacks:attacks
	    });
	}
	$("#unit"+this.id+" .upglist").html(Mustache.render(TEMPLATES["upglist-creation"],{upglist:q}));

	$("#unit"+this.id+" .upglist button").click(function(e) {
	    var data=e.currentTarget.getAttribute("data");
	    var num=e.currentTarget.getAttribute("num");
	    $("#unit"+this.id+" .upgs .upgavail").show();
	    $("#unit"+this.id+" .upgs .upg").show();
	    addupgrade(this,data,num);
	}.bind(this));
    }.bind(u));
}
function addunit(n,faction,u) {
    if (typeof u=="undefined") {
	u=new Unit(currentteam.team,n);
	u.faction=faction;
	for (var i in metaUnit.prototype) u[i]=metaUnit.prototype[i];
	for (var j in PILOTS[u.pilotid]) {
	    var p=PILOTS[u.pilotid];
	    if (typeof p[j]=="function") u[j]=p[j];
	}
    }
    if (typeof u.init!="undefined") {
	u.init();
    }
    if (currentteam.team==3) { $("#listunits").append("<li id='unit"+u.id+"'></li>");
    u.show();
    $("li#unit"+u.id).hover(function() { $(".highlighted").removeClass("highlighted"); 
					 $(this).addClass("highlighted"); },
			 function() { });
    if (u.unique==true) addunique(u.name);
    $("#unit"+u.id+" .close").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	$("#unit"+data+" .upg tr[data]").each(function() {
	    var d=$(this).attr("data");
	    if (UPGRADES[d].unique==true) removeunique(UPGRADES[d].name);
	});
	if (PILOTS[u.pilotid].unique==true) removeunique(u.name);
	$("#unit"+data).remove();
	delete generics["u"+data];
	currentteam.updatepoints();
    });
    $("#unit"+u.id+" .duplicate").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	var self=addunit(u.pilotid,faction);
	$("#unit"+data+" .upg tr[data]").each(function() {
	    var d=$(this).attr("data");
	    var num=$(this).attr("num");
	    if (UPGRADES[d].unique!=true&&u.upgnocopy!=d) addupgrade(self,d,num);
	});
    });
    $("#unit"+u.id+" .dialopen").click(function() {
	var data=$(this).attr("data");
	$("#unit"+data+" .upg").hide();
	$("#unit"+data+" .upglist").hide();
	$("#unit"+data+" .upgavail").hide();
	$("#unit"+data+" .statlist").hide();
	$("#unit"+data+" .shipdial").show();
	var u=generics["u"+data];
    });
    $("#unit"+u.id+" .upgradelists").click(function() {
	var data=$(this).attr("data");
	$("#unit"+data+" .upg").show();
	$("#unit"+data+" .upglist").show();
	$("#unit"+data+" .upgavail").show();
	$("#unit"+data+" .statlist").hide();
	$("#unit"+data+" .shipdial").hide();
	var u=generics["u"+data];
    });
    
    $("#unit"+u.id+" .statistics").click(function() {
	var data=$(this).attr("data");
	var u=generics["u"+data];
	$("#unit"+data+" .upg").hide();
	$("#unit"+data+" .upglist").hide();
	$("#unit"+data+" .upgavail").hide();
	$("#unit"+data+" .statlist").show();
	$("#unit"+data+" .shipdial").hide();

	var s= Snap("#unit"+data+" .statisticsvg");
	var sl = $("#unit"+data+" .statbutton");
	s.clear();
	var w=$(".statisticsvg").width();
	targetunit=new Unit(0,13);
	for (var i in metaUnit.prototype) targetunit[i]=metaUnit.prototype[i];
	u.moves = [ MT(w/2,w/2)];
	u.doactivation();
	u.s=s;
	var t=s.text(0,0,"Computing...").attr({"font-size":50,stroke:WHITE});
	setTimeout(function() {
	    u.showattack(u.weapons,s);
	    t.attr({display:"none"});
	    s.path(u.getOutlineString(MT(w/2,w/2)).s).attr({"stroke-width":5,stroke:"#0a0",opacity:0.5,fill:"rgba(0,0,0,0)",pointerEvents:"none"});
	    for (i=1; i<=5; i++) 
		s.path(u.getRangeString(i,MT(w/2,w/2))).attr({"stroke-width":5,stroke:"#0a0",opacity:0.5,fill:"rgba(0,0,0,0)",pointerEvents:"none","stroke-dasharray":"5,5"});
	    var g=s.gradient("l(0,0,0,1)hsl(0,80,50)-hsl(60,100,50)-hsl(120,100,25)");
	    s.rect(-400,-500,30,800).attr({fill:g});
	    s.text(-350,-450,"100%").attr({"font-size":50,stroke:WHITE});
	    s.text(-350,-75,"50%").attr({"font-size":50,stroke:WHITE});
	    s.text(-350,300,"0%").attr({"font-size":50,stroke:WHITE});
	},30);
    });
    currentteam.updatepoints();
    addupgradeaddhandler(u);
			     } else currentteam.updatepoints();
    return u;
}
function addupgrade(self,data,num,noremove) {
    var org=UPGRADES[data];
    $("#unit"+self.id+" .upglist").empty();
    if (typeof org=="undefined") return;
    //log("upgrade identified");
    if (org.unique==true) addunique(org.name);
    if (org.limited==true) addlimited(self,data);
    $("#unit"+self.id+" .upgavail span[num="+num+"]").hide();
    var text=translate(org.name).replace(/\(Crew\)/g,"").replace(/\'/g,"");
    if (typeof self.upgbonus[org.type]=="undefined") self.upgbonus[org.type]=0;
    var pts=org.points+self.upgbonus[org.type];
    if (org.points>=0&&pts<0) pts=0;
    var tt="";

    var tttext=formatstring(getupgtxttranslation(org.name,org.type));
    if (tttext!="") tt=tttext+(org.done==true?"":"<div><strong class='m-notimplemented'></strong></div>");
    $("#unit"+self.id+" .upg").append("<tr data="+data+" num="+num+"><td><span class='upgrades "+org.type+"'></span></td><td><button>"+text+"</button></td><td class='pts'>"+pts+"</td><td class='tooltip'>"+tt+"</td></tr>");
    self.upg[num]=data;
    var uu=Upgradefromid(self,data);
    if (typeof UPGRADES[data].install!="undefined") uu.install(self);
    Upgrade.prototype.install.call(uu,self);
    if (typeof uu.init!="undefined") uu.init(self);
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
    if (typeof noremove=="undefined") { 
	$("#unit"+self.id+" .upg tr[num="+num+"] button").click(function(e) {
	    var num=e.currentTarget.parentElement.parentElement.getAttribute("num");
	    var data=e.currentTarget.parentElement.parentElement.getAttribute("data");
	    $("#unit"+self.id+" .upglist").empty();
	    removeupgrade(self,num,data);
	}.bind(self));
    } else self.upgnocopy=data;

}
function removeupgrade(self,num,data) {
    var i;
    for (i in self.upgrades) 
	if (self.upgrades[i].id==data) break;
    var org=self.upgrades[i];;
    // Removing an upgrade giving an extra upgrade
    if (typeof self["addedupg"+data]!="undefined") {
	var c=self["addedupg"+data];
	if (self.upg[c]>-1) removeupgrade(self,c,self.upg[c]);
    }
    $("#unit"+self.id+" .upgavail span[num="+num+"]").show();
    $("#unit"+self.id+" .upg tr[num="+num+"]").remove();
    if (org.unique==true) removeunique(org.name);
    if (org.limited==true) removelimited(self,data);
    self.upg[num]=-1;
    if (typeof org.uninstall!="undefined") {
	org.uninstall(self);
    }
    Upgrade.prototype.uninstall.call(org,self);
    org.isactive=false;
    $("#unit"+self.id+" .shipdial").html("<table>"+self.getdialstring()+"</table>");

    self.showupgradeadd();
    self.showactionlist();
    self.showstats();
    currentteam.updatepoints();
}
var FREECOMBAT=0,SCENARIO=1,SCENARIOCREATOR=2;
var mode=FREECOMBAT;
function prepareforcombat(t,n) {
    $("#squad"+n).html(t);
    TEAMS[n].parseJuggler(t);
    TEAMS[n].name="SQUAD."+TEAMS[n].toASCII();
    TEAMS[n].toJSON();// Just for points
    if (typeof localStorage[TEAMS[n].name]=="undefined") {
	localStorage[TEAMS[n].name]=JSON.stringify({"pts":TEAMS[n].points,"faction":TEAMS[n].faction,"jug":t});
    }
    if (!SQUADLIST.isinrow(t)) {
	console.log("Juggler:"+t+" "+n+" ->" +TEAMS[n].toJuggler(true)+" "+TEAMS[n].faction);
	SQUADLIST.addrow(0,TEAMS[n].name,TEAMS[n].points,TEAMS[n].faction,TEAMS[n].toJuggler(true),true);
    }
    $("#squad"+n+"points").html(TEAMS[n].points);
    enablenextphase();
}
function scenariomode(b) {
    mode=b;
    switch(b) {
    case SCENARIO:
	$(".duelmode").hide();
	$(".scenariocreator").hide();
	$(".scenariomode").show();
	break;
    case FREECOMBAT:
	$(".scenariocreator").hide();
	$(".scenariomode").hide();
	$(".duelmode").show();
	break;
    case SCENARIOCREATOR:
	$(".duelmode").hide();
	$(".scenariomode").hide();
	$(".scenariocreator").show();
	
    }
}

function Scenariolist(id) {
    this.id=id;
    TEMPLATES["scenario-row-manage"]=$("#scenario-row-manage").html();
    Mustache.parse(TEMPLATES["scenario-row-manage"]);  
    TEMPLATES["scenario-header-manage"]=$("#scenario-header-manage").html();
    Mustache.parse(TEMPLATES["scenario-header-manage"]);  
    
    $(id).html(Mustache.render(TEMPLATES["scenario-header-manage"],{}));
    var self=this;

    $(id+" tbody").on( 'click', 'tr', function () {
        $(id+" .selected").removeClass('selected');
        $(this).addClass('selected');
    } );
}

Scenariolist.prototype = {
    isinrow: function(t) {
	return ((typeof this.rows!="undefined")&&(this.rows.indexOf(t)>-1)); 
    },
    addrow: function(title,text,wincond,link) {
	this.rows[this.nrows]={title:title,text:text,link:link,wincond:wincond};
	var arg=LZString.decompressFromEncodedURIComponent(link);
	var args=arg.split('&');
	TEAMS[3].parseASCII(args[1]);
	var victory="Death match";
	if (wincond>0) victory="Destroy all units before "+wincond+" turns";
	if (wincond<0) victory="Highest score after "+wincond+" turns";
	$(this.id +" tbody").append(
	    Mustache.render(TEMPLATES["scenario-row-manage"],{
		nrows:this.nrows,
		title:title,
		text:text,
		wincond:victory,
		faction:TEAMS[3].faction,
		link:link
	    }));
	this.nrows++;
	if (typeof localStorage[title]=="undefined") {
	    localStorage["SCENARIO"+title]=JSON.stringify({"title":title,"text":text,"link":link,"wincond":wincond});
	}
    },
    user: function() {
	var i;
	this.rows=[];
	this.nrows=0;
	$(this.id+" tbody").html("");
	this.log={};
	for (i in localStorage) {
	    if (typeof localStorage[i]=="string"&&i.match(/SCENARIO.*/)) {
		//delete localStorage[i];
		var l=$.parseJSON(localStorage[i]);
		if (typeof l.title=="undefined"||typeof l.text=="undefined"||typeof l.link=="undefined")
		    delete localStorage[i]
		else {
		    if (typeof l.wincond=="undefined") l.wincond=0;
		    this.addrow(l.title,l.text,l.wincond,l.link);
		}
	    }
	}
    },
    checkrow:function(t) {
	HEADERS=this.rows[t].text;
	SCENARIOTITLE=this.rows[t].title;
	WINCOND=this.rows[t].wincond;
	var link=this.rows[t].link;
	var arg=LZString.decompressFromEncodedURIComponent(link);
	var args=arg.split('&');
	prepareforcombat($("#squad1").html(),1);
	args[0]=TEAMS[1].toASCII();
	arg=args.join("&");
	document.location.search="?"+LZString.compressToEncodedURIComponent(arg);
    }
}
