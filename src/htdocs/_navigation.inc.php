<?php
  include_once 'functions.inc.php';
  include_once __DIR__ . '/../conf/config.inc.php';

  echo navGroup('Network Operations Web Services',
      navItem($CONFIG['MOUNT_PATH'] . '/telemetry.html',
          'Telemetry Documentation')
    );
