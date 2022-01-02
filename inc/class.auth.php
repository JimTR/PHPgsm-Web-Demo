<?PHP
$build = "10915-2645781980";
$version = "3.00";
$time = "1639128588";
    class Auth
    {
        const SALT = 'insert some random text here';

        private static $me;

        public $id;
        public $username;
        public $user;
        public $expiryDate;
        public $nid;
        //global $database;
        
        private $loggedIn;

        public function __construct()
        {
			$d = new DateTime();
            $d->modify("+6 months");
            $this->id         = null;
            $this->nid        = null;
            $this->username   = null;
            $this->user       = null;
            $this->loggedIn   = false;
            $this->expiryDate = $d->format("U"); 
            //$this->user       = new User();
            $this->currentip = getip();
            
            
        }

        public static function getAuth()
        {
            if(is_null(self::$me))
            {
                self::$me = new Auth();
                self::$me->init();
            }
            return self::$me;
        }

        public function init()
        {
            $this->setACookie();
            $this->loggedIn = $this->attemptCookieLogin();
        }

        public function login($username, $password)
        {
            $this->loggedIn = false;
			global $database;
            //$db = Database::getDatabase();
            $hashed_password = self::hashedPassword($password);
            //$database = new db;
            $row = $database->get_Row("SELECT * FROM users WHERE username = '" . $username . "' AND password = '" . $hashed_password."'");
            
            if(!$row) {
                return false;
            }
            $this->id       = $row['id'];
            $this->nid      = $row['nid'];
            $this->username = $row['username'];
            $this->email =    $row['email'];
            //$this->currentip = $row['currentip'];
            $this->level = $row['level'];
            //$this->postnum = $row['postnum'];
            $this->regdate = $row['regdate'];
            $update = array( 'currentip' => $this->currentip);
			 $update_where = array( 'id' => $row['id']);
			 $database->update( 'users', $update, $update_where);
			 $this->loggedIn = true;
			 $cookie_options = array (
                'expires' => $this->expiryDate,
                'path' => '/',
                'domain' => '', // leading dot for compatibility or use subdomain
                'secure' => true,     // or false
                'httponly' => true,    // or false
                'samesite' => 'Lax' // None || Lax  || Strict
                );
			 setcookie("userid",$this->id,$cookie_options);
             setcookie("phpgsm",$this->nid,$cookie_options);
			//$_SESSION['userid'] = $row['id'];
            return true;
        }

        public function logout()
        {
            $this->loggedIn = false;
            $this->clearCookies();
            //session_destroy();
        }

        public function loggedIn()
        {
			global $database;
			//echo $this->nid;
			$sql = "select * from sessions where ";
			if (isset($_COOKIE["phpgsm"]))
			{
              $this->loggedIn = true;
            }
            return $this->loggedIn;
            
        }

        public function requireUser()
        {
            if(!$this->loggedIn())
                $this->sendToLoginPage();
        }

        public function requireAdmin()
        {
            if(!$this->loggedIn() || !$this->isAdmin())
                $this->sendToLoginPage();
        }

        public function isAdmin()
        {
            return ($this->level === 'admin');
        }

        public function changeCurrentUsername($new_username)
        {
            $db = Database::getDatabase();
            srand(time());
            $this->user->nid = Auth::newNid();
            $this->nid = $this->user->nid;
            $this->user->username = $new_username;
            $this->username = $this->user->username;
            $this->user->update();
            $this->generateBCCookies();
        }

        public function changeCurrentPassword($new_password)
        {
            $db = Database::getDatabase();
            srand(time());
            $this->user->nid = self::newNid();
            $this->user->password = self::hashedPassword($new_password);
            $this->user->update();
            $this->nid = $this->user->nid;
            $this->generateBCCookies();
        }

        public static function changeUsername($id_or_username, $new_username)
        {
            if(ctype_digit($id_or_username))
                $u = new User($id_or_username);
            else
            {
                $u = new User();
                $u->select($id_or_username, 'username');
            }

            if($u->ok())
            {
                $u->username = $new_username;
                $u->update();
            }
        }

        public static function changePassword($id_or_username, $new_password)
        {
            if(ctype_digit($id_or_username))
                $u = new User($id_or_username);
            else
            {
                $u = new User();
                $u->select($id_or_username, 'username');
            }

            if($u->ok())
            {
                $u->nid = self::newNid();
                $u->password = self::hashedPassword($new_password);
                $u->update();
            }
        }

        public static function createNewUser($username, $password = null)
        {
	    $db = Database::getDatabase();
            
            $user_exists = $db->getValue("SELECT COUNT(*) FROM users WHERE username = " . $db->quote($username));
            //die ("Users = ".$user_exists);
            if($user_exists > 0)
                return false;

            if(is_null($password))
                $password = Auth::generateStrongPassword();

            srand(time());
            $u = new User();
            $u->username = $username;
            $u->nid = self::newNid();
            $u->password = self::hashedPassword($password);
            
            $u->insert();
            return $u;
        }

        public static function generateStrongPassword($length = 9, $add_dashes = false, $available_sets = 'luds')
        {
            $sets = array();
            if(strpos($available_sets, 'l') !== false)
                $sets[] = 'abcdefghjkmnpqrstuvwxyz';
            if(strpos($available_sets, 'u') !== false)
                $sets[] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
            if(strpos($available_sets, 'd') !== false)
                $sets[] = '23456789';
            if(strpos($available_sets, 's') !== false)
                $sets[] = '!@#$%&*?';

            $all = '';
            $password = '';
            foreach($sets as $set)
            {
                $password .= $set[array_rand(str_split($set))];
                $all .= $set;
            }

            $all = str_split($all);
            for($i = 0; $i < $length - count($sets); $i++)
                $password .= $all[array_rand($all)];

            $password = str_shuffle($password);

            if(!$add_dashes)
                return $password;

            $dash_len = floor(sqrt($length));
            $dash_str = '';
            while(strlen($password) > $dash_len)
            {
                $dash_str .= substr($password, 0, $dash_len) . '-';
                $password = substr($password, $dash_len);
            }
            $dash_str .= $password;
            return $dash_str;
        }

        public function impersonateUser($id_or_username)
        {
            if(ctype_digit($id_or_username))
                $u = new User($id_or_username);
            else
            {
                $u = new User();
                $u->select($id_or_username, 'username');
            }

            if(!$u->ok()) return false;

            $this->id       = $u->id;
            $this->nid      = $u->nid;
            $this->username = $u->username;
            $this->user     = $u;
            $this->generateBCCookies();

            return true;
        }

        private function attemptCookieLogin()
        {
            
			if(!isset($_COOKIE['phpgsm']))
			{ 
				return false;
			}
            
             global $database;
			 $nid = $_COOKIE["phpgsm"]; // get the user
            // We SELECT * so we can load the full user record into the user DBObject later (no longer used 20-10-14)
            
            $row = $database->get_Row('SELECT * FROM users WHERE nid = "' . $nid.'"');
            if($row === false)
                return false;
            
             foreach ($row as $key => $val) {
				 if (!is_int($key)){
					$this->$key = $val;
					}
				}
				 $cookie_options = array (
                'expires' => $this->expiryDate,
                'path' => '/',
                'domain' => '', // leading dot for compatibility or use subdomain
                'secure' => true,     // or false
                'httponly' => true,    // or false
                'samesite' => 'Lax' // None || Lax  || Strict
                );
            setcookie("userid",$this->id,$cookie_options);
            setcookie("phpgsm",$this->nid,$cookie_options);
             $update = array( 'currentip' => $this->currentip); // update last movement
			 $update_where = array( 'id' => $row['id']);
			 $database->update( 'users', $update, $update_where, 1 );
			 //$database->disconnect();
            //$_SESSION['userid'] = $row['id'];
            return true;
        }

        private function setACookie()
        {
            if(!isset($_COOKIE['A']))
            {
                srand(time());
                $a = md5(rand() . microtime());
                //setcookie('A', $a, $this->expiryDate, '/', Config::get('authDomain'));
            }
        }

        private function generateBCCookies()
        {
            $c  = '';
            $c .= 'n=' . base64_encode($this->nid) . '&';
            $c .= 'l=' . str_rot13($this->username) . '&';
            $c = base64_encode($c);
            $c = str_rot13($c);

            $sig = md5($c . $this->expiryDate . self::SALT);
            $b = "x={$this->expiryDate}&s=$sig";
            $b = base64_encode($b);
            $b = str_rot13($b);
            //echo "cookies at ".Config::get('authDomain')." Here ";
            //die();
            //setcookie('B', $b, $this->expiryDate, '/', Config::get('authDomain'));
            //setcookie('C', $c, $this->expiryDate, '/', Config::get('authDomain'));
        }

        private function clearCookies()
        {
			//die ("auth dom ".Config::get('authDomain'));
			 $cookie_options = array (
                'expires' => time()-3600,
                'path' => '/',
                'domain' => '', // leading dot for compatibility or use subdomain
                'secure' => true,     // or false
                'httponly' => true,    // or false
                'samesite' => 'Lax' // None || Lax  || Strict
                );
            setcookie ("phpgsm", "", $cookie_options);
            setcookie('userid', '', $cookie_options);
        }

        private function sendToLoginPage()
        {
            $url = $this->loginUrl;

            $full_url = full_url();
            if(strpos($full_url, 'logout') === false)
            {
                $url .= '?r=' . $full_url;
            }

            redirect($url);
        }

        private static function hashedPassword($password)
        {
            return md5($password . self::SALT);
        }

        private static function newNid()
        {
            srand(time());
            return md5(rand() . microtime());
        }
    }
