import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

// Cesium Ion Access Token 설정
Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzODNiZmZiNC04YTUxLTQ1YzgtOWU1Mi1kNDUyY2I2ZDRkNTQiLCJpZCI6MzQyNDEzLCJpYXQiOjE3NTgxNzMyNDh9.zZRyMPovg5ALhNtG2_E-0ED0qHqd_uQQnAG84eQUyG4';

// IP 주소 생성 함수
const generateIP = (country) => {
  const ipRanges = {
    '중국': ['123.125.', '61.135.', '220.181.', '114.80.'],
    '러시아': ['93.184.', '212.22.', '195.34.', '81.23.'],
    '북한': ['175.45.', '210.52.', '202.131.', '202.174.'],
    '이란': ['2.176.', '78.39.', '91.99.', '185.143.'],
    '미국': ['8.8.', '208.67.', '173.252.', '199.232.'],
    '일본': ['103.4.', '210.173.', '133.242.', '202.32.'],
    '독일': ['217.160.', '62.75.', '188.40.', '85.13.'],
    '영국': ['212.58.', '151.101.', '185.31.', '195.59.'],
    '대한민국': ['168.126.', '203.248.', '218.234.', '121.78.']
  };

  const prefix = ipRanges[country.name][Math.floor(Math.random() * ipRanges[country.name].length)];
  const suffix1 = Math.floor(Math.random() * 256);
  const suffix2 = Math.floor(Math.random() * 256);
  return prefix + suffix1 + '.' + suffix2;
};

// AS 정보 생성 함수
const generateAS = (country) => {
  const asNumbers = {
    '중국': ['AS4134 CHINANET', 'AS4837 CHINA169', 'AS9808 CMNET', 'AS24400 ALIBABA'],
    '러시아': ['AS8359 MTS', 'AS12389 ROSTELECOM', 'AS31133 MF-MGSM', 'AS42610 NCNET'],
    '북한': ['AS131279 STAR-KP', 'AS9769 DPRK-AS', 'AS17762 KPTC-AS'],
    '이란': ['AS44244 IRANCELL', 'AS6736 BARIN', 'AS197207 MCCI', 'AS58224 TCI'],
    '미국': ['AS15169 GOOGLE', 'AS8075 MICROSOFT', 'AS16509 AMAZON', 'AS32934 FACEBOOK'],
    '일본': ['AS2516 KDDI', 'AS4713 NTT', 'AS2497 IIJ', 'AS7506 GMO'],
    '독일': ['AS3320 DEUTSCHE', 'AS8881 1&1', 'AS20940 AKAMAI', 'AS24940 HETZNER'],
    '영국': ['AS2856 BT', 'AS5089 VIRGIN', 'AS12576 EE', 'AS13037 ZEN'],
    '대한민국': ['AS9318 SKB', 'AS4766 KT', 'AS9644 LGU', 'AS17858 LG-DACOM']
  };

  const asList = asNumbers[country.name];
  return asList[Math.floor(Math.random() * asList.length)];
};

// 한국 중심 사이버 공격 시뮬레이션 데이터 (IP/AS 정보 포함)
const generateAttackData = () => {
  const attackTypes = ['DDoS', 'APT', 'Phishing', 'Ransomware', 'Botnet', 'SQL Injection', 'Zero-day'];

  const korea = { name: '대한민국', lat: 37.5665, lon: 126.9780 };
  const threatCountries = [
    { name: '중국', lat: 35.8617, lon: 104.1954 },
    { name: '러시아', lat: 61.5240, lon: 105.3188 },
    { name: '북한', lat: 40.3399, lon: 127.5101 },
    { name: '이란', lat: 32.4279, lon: 53.6880 },
    { name: '미국', lat: 39.8283, lon: -98.5795 },
    { name: '일본', lat: 36.2048, lon: 138.2529 },
    { name: '독일', lat: 51.1657, lon: 10.4515 },
    { name: '영국', lat: 55.3781, lon: -3.4360 }
  ];

  const attacks = [];

  // 한국을 대상으로 하는 공격 (70%)
  for (let i = 0; i < 35; i++) {
    const source = threatCountries[Math.floor(Math.random() * threatCountries.length)];
    const sourceIP = generateIP(source);
    const sourceAS = generateAS(source);
    const targetIP = generateIP(korea);
    const targetAS = generateAS(korea);

    attacks.push({
      id: i,
      source: { ...source, ip: sourceIP, as: sourceAS },
      target: { ...korea, ip: targetIP, as: targetAS },
      type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      severity: Math.floor(Math.random() * 5) + 1,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      status: Math.random() > 0.25 ? 'active' : 'blocked'
    });
  }

  // 한국에서 나가는 방어적 대응/역추적 (30%)
  for (let i = 35; i < 50; i++) {
    const target = threatCountries[Math.floor(Math.random() * threatCountries.length)];
    const sourceIP = generateIP(korea);
    const sourceAS = generateAS(korea);
    const targetIP = generateIP(target);
    const targetAS = generateAS(target);

    attacks.push({
      id: i,
      source: { ...korea, ip: sourceIP, as: sourceAS },
      target: { ...target, ip: targetIP, as: targetAS },
      type: '역추적',
      severity: Math.floor(Math.random() * 3) + 1,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      status: Math.random() > 0.6 ? 'active' : 'blocked'
    });
  }

  return attacks;
};

const EarthGlobe = () => {
  const cesiumContainer = useRef(null);
  const viewer = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const [attackStats, setAttackStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    countries: 0
  });

  // 공격 데이터 초기화 및 업데이트
  useEffect(() => {
    const initializeAttacks = () => {
      const attackData = generateAttackData();
      setAttacks(attackData);

      const stats = {
        total: attackData.length,
        active: attackData.filter(a => a.status === 'active').length,
        blocked: attackData.filter(a => a.status === 'blocked').length,
        countries: new Set([...attackData.map(a => a.source.name), ...attackData.map(a => a.target.name)]).size
      };
      setAttackStats(stats);
    };

    initializeAttacks();

    // 실시간 업데이트 시뮬레이션 (5초마다)
    const interval = setInterval(initializeAttacks, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    const initializeCesium = async () => {
      try {
        console.log('Cesium 초기화 시작...');
        console.log('Access Token:', Cesium.Ion.defaultAccessToken ? '설정됨' : '없음');

        // Cesium Viewer 생성 - Google Earth와 유사한 설정
        viewer.current = new Cesium.Viewer(cesiumContainer.current, {
          // UI 요소들 정리 (깔끔한 지구본)
          animation: false,
          baseLayerPicker: true,  // 레이어 선택 가능하도록
          fullscreenButton: true,
          geocoder: true,
          homeButton: true,
          infoBox: true,
          sceneModePicker: true,  // 2D/3D 모드 선택 가능
          selectionIndicator: true,
          timeline: false,
          navigationHelpButton: true,
          navigationInstructionsInitiallyVisible: false,

          // 고품질 지형 데이터 사용
          terrainProvider: await Cesium.createWorldTerrainAsync({
            requestWaterMask: true,
            requestVertexNormals: true
          })
        });

        // 전체화면 버튼 커스터마이징 - 모니터 전체화면으로 설정
        const fullscreenButton = viewer.current.fullscreenButton;
        fullscreenButton.viewModel.command.beforeExecute.addEventListener((e) => {
          e.cancel = true; // 기본 전체화면 동작 취소

          // 브라우저 전체화면 API 사용
          const element = document.documentElement;
          if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
              element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
              element.msRequestFullscreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          }
        });

        console.log('Cesium Viewer 생성 완료');

        // 추가 고해상도 이미지 레이어들 추가
        const imageryLayers = viewer.current.imageryLayers;

        // 고해상도 위성 이미지는 기본 Ion 이미지로 대체
        // Bing Maps는 키가 필요하므로 제거

        // 3D 건물 타일셋 추가 (OpenStreetMap 건물)
        try {
          const buildingTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
          viewer.current.scene.primitives.add(buildingTileset);
          console.log('3D 건물 데이터 로드 완료');
        } catch (error) {
          console.log('3D 건물 데이터 로드 실패:', error);
        }

        // 고해상도 이미지 레이어 추가 (Bing Maps Aerial)
        try {
          const bingProvider = await Cesium.createWorldImageryAsync({
            style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
          });
          viewer.current.imageryLayers.add(viewer.current.imageryLayers.addImageryProvider(bingProvider));
          console.log('고해상도 이미지 레이어 추가 완료');
        } catch (error) {
          console.log('고해상도 이미지 레이어 추가 실패:', error);
        }

      // 지구본 고급 설정
      const scene = viewer.current.scene;
      const globe = scene.globe;

      // 실제적인 조명 및 대기 효과
      scene.skyAtmosphere.show = true;
      scene.fog.enabled = true;
      scene.fog.density = 0.0001;
      scene.fog.screenSpaceErrorFactor = 2.0;

      // 고품질 지구본 렌더링
      globe.enableLighting = true;
      globe.dynamicAtmosphereLighting = true;
      globe.atmosphereLightIntensity = 10.0;
      globe.showWaterEffect = true;

      // 지형 상세도 최대화
      globe.maximumScreenSpaceError = 1.0;  // 더 높은 상세도
      globe.tileCacheSize = 1000;  // 더 많은 타일 캐시

      // 카메라 움직임 제한 설정 (지구본 완전 중앙 고정)
      scene.screenSpaceCameraController.enableRotate = true;
      scene.screenSpaceCameraController.enableTranslate = false; // 패닝 완전 비활성화
      scene.screenSpaceCameraController.enableZoom = true;
      scene.screenSpaceCameraController.enableTilt = false; // 기울이기도 비활성화하여 정중앙 유지
      scene.screenSpaceCameraController.enableLook = false;

      // 줌 범위 제한 (건물까지 보이도록 최소 거리 줄임)
      scene.screenSpaceCameraController.minimumZoomDistance = 100; // 최소 줌 (100m) - 건물 레벨까지
      scene.screenSpaceCameraController.maximumZoomDistance = 20000000; // 최대 줌 (20000km)

      // 카메라가 항상 지구 중심을 바라보도록 설정 (간단한 방법)
      scene.screenSpaceCameraController.constrainedAxis = Cesium.Cartesian3.UNIT_Z;

      // 마우스 상호작용 및 정보 표시 활성화
      viewer.current.cesiumWidget.creditContainer.style.display = "none";  // 크레딧 숨기기

      

      // 지형 클릭 시 좌표 정보 표시
      viewer.current.screenSpaceEventHandler.setInputAction((event) => {
        const cartesian = viewer.current.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          const longitude = Cesium.Math.toDegrees(cartographic.longitude);
          const latitude = Cesium.Math.toDegrees(cartographic.latitude);
          const height = cartographic.height;

          console.log(`위치: 위도 ${latitude.toFixed(6)}, 경도 ${longitude.toFixed(6)}, 고도 ${height.toFixed(2)}m`);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 초기 카메라 위치 - 지구본 정중앙 고정
      viewer.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 15000000), // 지구 중심에서 시작
        orientation: {
          heading: 0,
          pitch: -Cesium.Math.PI_OVER_TWO, // 직각 아래 시점으로 정중앙 고정
          roll: 0
        }
      });

      // 고품질 렌더링 설정
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        viewer.current.resolutionScale = window.devicePixelRatio;
      }

      // 장면 설정
      scene.postProcessStages.fxaa.enabled = true;

        setIsLoaded(true);

      } catch (error) {
        console.error('Cesium 초기화 오류:', error);
        setError(`Cesium 초기화 실패: ${error.message}`);
      }
    };

    initializeCesium();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (viewer.current) {
        viewer.current.destroy();
        viewer.current = null;
      }
    };
  }, []);

  // 공격 시각화 효과
  useEffect(() => {
    if (!viewer.current || !isLoaded || !attacks || attacks.length === 0) return;

    // 기존 엔티티 제거
    viewer.current.entities.removeAll();

    attacks.forEach((attack, index) => {
      // 공격 출발지 마커 (깔끔한 점 + 국가명만 표시)
      const sourceEntity = viewer.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(attack.source.lon, attack.source.lat),
        point: {
          pixelSize: 10,
          color: attack.status === 'active' ? Cesium.Color.RED : Cesium.Color.GRAY,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: attack.source.name,
          font: '12pt Arial, sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -25),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scale: 0.9
        },
        // 상세 정보를 속성으로 저장
        description: `
          <div style="font-family: Arial, sans-serif; font-size: 14px;">
            <h3 style="color: #ff4444; margin: 0 0 10px 0;">공격 출발지</h3>
            <p><strong>국가:</strong> ${attack.source.name}</p>
            <p><strong>공격 유형:</strong> ${attack.type}</p>
            <p><strong>IP 주소:</strong> ${attack.source.ip}</p>
            <p><strong>AS 정보:</strong> ${attack.source.as}</p>
            <p><strong>상태:</strong> ${attack.status === 'active' ? '🔴 진행중' : '🛡️ 차단됨'}</p>
            <p><strong>심각도:</strong> ${'⭐'.repeat(attack.severity)}</p>
            <p><strong>탐지 시간:</strong> ${attack.timestamp.toLocaleString()}</p>
          </div>
        `
      });

      // 공격 목표지 마커 (깔끔한 점 + 국가명만 표시)
      const targetEntity = viewer.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(attack.target.lon, attack.target.lat),
        point: {
          pixelSize: 10,
          color: Cesium.Color.BLUE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: attack.target.name,
          font: '12pt Arial, sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -25),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scale: 0.9
        },
        // 상세 정보를 속성으로 저장
        description: `
          <div style="font-family: Arial, sans-serif; font-size: 14px;">
            <h3 style="color: #4444ff; margin: 0 0 10px 0;">공격 목표지</h3>
            <p><strong>국가:</strong> ${attack.target.name}</p>
            <p><strong>IP 주소:</strong> ${attack.target.ip}</p>
            <p><strong>AS 정보:</strong> ${attack.target.as}</p>
            <p><strong>공격 유형:</strong> ${attack.type}</p>
            <p><strong>상태:</strong> ${attack.status === 'active' ? '🔴 공격받는중' : '🛡️ 차단됨'}</p>
            <p><strong>심각도:</strong> ${'⭐'.repeat(attack.severity)}</p>
            <p><strong>탐지 시간:</strong> ${attack.timestamp.toLocaleString()}</p>
          </div>
        `
      });

      // 공격 라인 (활성 공격만) - 세련된 움직이는 광원
      if (attack.status === 'active') {
        const isKoreaTarget = attack.target.name === '대한민국';
        const lineColor = isKoreaTarget ? Cesium.Color.RED : Cesium.Color.CYAN;

        // 메인 광원 라인
        viewer.current.entities.add({
          polyline: {
            positions: [
              Cesium.Cartesian3.fromDegrees(attack.source.lon, attack.source.lat, 80000),
              Cesium.Cartesian3.fromDegrees(attack.target.lon, attack.target.lat, 80000)
            ],
            width: 3, // 더 굵게
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.4,
              taperPower: 0.8,
              color: lineColor.withAlpha(0.8)
            }),
            clampToGround: false,
            arcType: Cesium.ArcType.GEODESIC
          }
        });

        // 움직이는 애니메이션 라인 (흐르는 효과)
        viewer.current.entities.add({
          polyline: {
            positions: [
              Cesium.Cartesian3.fromDegrees(attack.source.lon, attack.source.lat, 85000),
              Cesium.Cartesian3.fromDegrees(attack.target.lon, attack.target.lat, 85000)
            ],
            width: 2,
            material: new Cesium.PolylineArrowMaterialProperty(lineColor.withAlpha(0.9)),
            clampToGround: false,
            arcType: Cesium.ArcType.GEODESIC
          }
        });

        // 외곽 글로우 효과
        viewer.current.entities.add({
          polyline: {
            positions: [
              Cesium.Cartesian3.fromDegrees(attack.source.lon, attack.source.lat, 75000),
              Cesium.Cartesian3.fromDegrees(attack.target.lon, attack.target.lat, 75000)
            ],
            width: 5,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.2,
              taperPower: 1.0,
              color: lineColor.withAlpha(0.3)
            }),
            clampToGround: false,
            arcType: Cesium.ArcType.GEODESIC
          }
        });
      }
    });
  }, [attacks, isLoaded]);

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          p: 2
        }}
      >
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          1. https://cesium.com/ion/ 방문<br/>
          2. 무료 계정 생성<br/>
          3. Access Token 발급<br/>
          4. EarthGlobe.jsx 파일의 토큰 교체
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', gap: 2 }}>
      {/* 지구본 영역 */}
      <Box sx={{ flex: 1, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
        <div
          ref={cesiumContainer}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        />
        {!isLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.1)',
              borderRadius: 2
            }}
          >
            <Typography>실제 지구본 로딩 중...</Typography>
          </Box>
        )}

        {/* 품질 표시 */}
        {isLoaded && (
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 1,
            fontSize: 10
          }}>
            <Typography variant="caption" color="inherit">
              🌍 실제 위성 데이터
            </Typography>
          </Box>
        )}
      </Box>

      {/* 공격 현황 패널 */}
      <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* 실시간 통계 */}
        <Card sx={{ bgcolor: '#1a1a1a', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff4444' }}>
              🚨 대한민국 사이버 보안 현황
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ff4444', fontWeight: 'bold' }}>
                    {attackStats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    총 공격 수
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#44ff44', fontWeight: 'bold' }}>
                    {attackStats.blocked}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    차단됨
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ffaa44', fontWeight: 'bold' }}>
                    {attackStats.active}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    진행 중
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4444ff', fontWeight: 'bold' }}>
                    {attackStats.countries}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    관련 국가
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 최근 공격 목록 */}
        <Card sx={{ bgcolor: '#1a1a1a', color: 'white', flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff4444' }}>
              📊 실시간 공격 로그
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {attacks && attacks.slice(0, 10).map((attack, index) => (
                <Box
                  key={attack.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    bgcolor: attack.status === 'active' ? 'rgba(255,68,68,0.1)' : 'rgba(136,136,136,0.1)',
                    borderRadius: 1,
                    borderLeft: `3px solid ${attack.status === 'active' ? '#ff4444' : '#888888'}`
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {attack.type} - {attack.status === 'active' ? '🔴 진행중' : '🛡️ 차단됨'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ccc' }}>
                    {attack.source.name} → {attack.target.name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#aaa', fontSize: '10px' }}>
                    출발: {attack.source.ip} ({attack.source.as})
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#aaa', fontSize: '10px' }}>
                    도착: {attack.target.ip} ({attack.target.as})
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#aaa' }}>
                    심각도: {'⭐'.repeat(attack.severity)} | {attack.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* 범례 */}
        <Card sx={{ bgcolor: '#1a1a1a', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1, color: '#ff4444' }}>
              🔍 범례
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff4444' }} />
                <Typography variant="caption">활성 공격원</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#888888' }} />
                <Typography variant="caption">차단된 공격원</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4444ff' }} />
                <Typography variant="caption">표적 지역</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 2, bgcolor: '#ff4444', borderRadius: 1, boxShadow: '0 0 4px #ff4444' }} />
                <Typography variant="caption">한국 대상 공격</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 2, bgcolor: '#00ffff', borderRadius: 1, boxShadow: '0 0 4px #00ffff' }} />
                <Typography variant="caption">한국 역추적</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EarthGlobe;