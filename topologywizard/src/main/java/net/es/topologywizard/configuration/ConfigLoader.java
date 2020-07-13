package net.es.topologywizard.configuration;

import java.util.Properties;  
import java.io.*;  


public class ConfigLoader {
	
   
       private final String PROP_FILE="config/connectivity.properties";  
       public void readPropertiesFile() {  
    	   try {  
    		   InputStream is = new FileInputStream(new File(PROP_FILE));

    		   Properties prop = new Properties();  
    		   prop.load(is);  
    		   String server = prop.getProperty("server");  
    		   String uname = prop.getProperty("uname");  
    		   String  passwd = prop.getProperty("passwd");  
               is.close();  
               
               
           } catch (Exception e) {  
        	   System.out.println("Failed to read from " + PROP_FILE + " file.");  
               e.printStackTrace();  
           }  
       }  
      }  


 