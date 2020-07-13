package net.es.topologywizard.servlet;


import java.lang.*;
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;
import javax.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

import net.sf.json.JSONArray;
import net.sf.json.xml.XMLSerializer;

import org.apache.geronimo.mail.util.QuotedPrintable;
import org.apache.xerces.impl.dv.dtd.NMTOKENDatatypeValidator;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;
import java.util.Iterator;
import java.util.Properties;
import java.util.Map.Entry;

import net.es.topologywizard.format.nml.*;
import net.es.topologywizard.format.nmwg.*;


public class TopologyPersistence extends HttpServlet
{ 
	
	private final String PROP_FILE="config/connectivity.properties";
	
	private String server;
	
	private String uname;
	
	private String passwd;

	
	public void doGet(HttpServletRequest req, HttpServletResponse res)
	throws ServletException,IOException
	{
		res.setContentType("text/javascript");
		PrintWriter out = res.getWriter();
		
		// connecting to database
		Connection con = null;    
		Statement stmt = null;
		ResultSet rs = null;
	
		String p_name = req.getParameter("name");
		String p_working = req.getParameter("working");
		String p_language = req.getParameter("language"); 
		
		String p_method = req.getParameter("method");
		
	       
 	   try {  
 		   InputStream is = new FileInputStream(new File(PROP_FILE));

 		   Properties prop = new Properties();  
 		   prop.load(is);  
 		   this.server = prop.getProperty("server");  
 		   this.uname = prop.getProperty("uname");  
 		   this.passwd = prop.getProperty("passwd");  
            is.close();  
            
            
        } catch (Exception e) {  
     	   System.out.println("Failed to read from " + PROP_FILE + " file.");  
            e.printStackTrace();  
        }  

		
		try 
		{
			Class.forName("com.mysql.jdbc.Driver");
			con = DriverManager.getConnection ("jdbc:mysql://" + this.server +"/topoviz", this.uname, this.passwd);
			stmt = con.createStatement();
			String query = null;
			
			if(p_method.equals("loadWirings"))
			{
				query = "SELECT * from wirings WHERE name='" + p_name + "' AND language='"+ p_language +"'";				
			}
				
			else if(p_method.equals("listWirings"))
			{
				query = "SELECT * from wirings WHERE language='"+ p_language + "'";
			}
			
			
	       int count = 0;
	    
	       rs = stmt.executeQuery(query);
	    
	       while(rs.next())
	       {
	    	   count++;
	       }  
	       String result_set[] = null;
	       
	       ArrayList<ArrayList<String>> resultset_lol = new ArrayList<ArrayList<String>>();
	      
	       ArrayList<JSONArray> resultset_list = new ArrayList<JSONArray>();
	       
	       if(count > 0)
	       {
		      result_set = new String[count];
		       
		       rs.first();
		       
		       count = 0;
		       
		       String name_string = "name";
		       String lang_string = "language";
		       
		       do{		    	   
		    	   //ArrayList<JSONArray> resultset_list = new ArrayList<JSONArray>();
		    	   
		    	   JSONArray jsarray = null;
		    	   try
		    	   {
		    		
		    		   
			    	  /* resultset_list.add(new JSONObject().put("name", rs.getString ("name")).toString());
			    	   resultset_list.add(new JSONObject().put("language", rs.getString ("language")).toString());
			    	   resultset_list.add(rs.getString("working"));*/
		    		     
		    		  jsarray  = new JSONArray();
		    		   
		    		   JSONObject jo_name = new JSONObject().put("name", rs.getString ("name"));
		    		   JSONObject jo_lang = new JSONObject().put("language", rs.getString ("language"));
		    		   JSONObject jo_working = new JSONObject().put("working", rs.getString ("working"));
		    		 
		    		   
		    		   jsarray.add(jo_name.toString());
		    		   jsarray.add(jo_lang.toString());
		    		   jsarray.add(jo_working.toString());
		    		   
		    		   
		    	   }
		    	   catch(JSONException j)
		    	   {
		    		   
		    	   }
		    	   //resultset_lol.add(resultset_list);
		    	   
		    	   resultset_list.add(jsarray);
		    	   
		    	 /*  String name = rs.getString ("name");
		           String language = rs.getString("language"); 	 
		           String working = rs.getString("working");*/
		           
		         //  result_set[count++] = "name="+name+", working="+working+ ", language="+ language;	           
		       }while(rs.next());
		       
		       
		       rs.close();
		       stmt.close(); 
		       
		      // JSONArray jsonArray = JSONArray.fromObject(resultset_lol);
		     //  JSONArray jsonArray = JSONArray.fromObject(resultset_list); 
		       
		     //   net.sf.json.JSONObject json = JSONObject.("{\"name\":\"json\",\"bool\":true,\"int\":1}");  
		     //  String xml = XMLSerializer.write( json );  
		      
		       out.print(resultset_list);
		       
		       JSONArray jsona = JSONArray.fromObject(resultset_list);  
		       //String xml = XMLSerializer.write(json); 
		       
		       XMLSerializer xml_sz= new  XMLSerializer();
			
		       String xml_str = xml_sz.write(jsona); 
		       
				FileWriter fileWriter = new FileWriter("topology-info.xml");
				
				fileWriter.write(xml_str);
				
				fileWriter.close();
		         
	       }
	     /*  for(int i=0;i<result_set.length;i++)
	       {
	    	   out.print(result_set[i]);
	       }*/
	       out.close();
	      
		}
		catch (SQLException e) 
		{
			throw new ServletException("Some issue with sql syntax.", e);
		} 
		catch (ClassNotFoundException e) 
		{
			  throw new ServletException("JDBC Driver not found.", e);
		}
		finally 
		{
			try 
			{
				if(rs != null) 
				{
					rs.close();
					rs = null;
				}
				if(stmt != null)
				{
					stmt.close();
					stmt = null;
				}
				if(con != null)
				{
					con.close();
					con = null;
				}
			}
			catch (SQLException e) 
			{
				
			}
		}

		
	}

	public void doDelete(HttpServletRequest req, HttpServletResponse res)
	throws ServletException,IOException
	{

			res.setContentType("text/javascript");
			PrintWriter out = res.getWriter();
			
			
			// connecting to database
			Connection con = null;    
			Statement stmt = null;
			ResultSet rs = null;
		
			String p_name = req.getParameter("name");
			String p_working = req.getParameter("working");
			String p_language = req.getParameter("language"); 
			
			String p_method = req.getParameter("method");
			
		       
	       this.readConfigProperties();
			
			
			try 
			{
				Class.forName("com.mysql.jdbc.Driver");
				con = DriverManager.getConnection ("jdbc:mysql://" + this.server +"/topoviz", this.uname, this.passwd);
				stmt = con.createStatement();
				String query = null;
				
				if(p_method.equals("deleteWiring"))
				{
					query = "delete from wirings WHERE name='" + p_name + "' AND language='"+ p_language +"'";				
				}
				
		       int count;
		    
		       count = stmt.executeUpdate(query);
		       
		       //if(count > 0 )
		       out.print("true");
		     
		       stmt.close ();
		      
		       out.close();

			}
			catch (SQLException e) 
			{
				throw new ServletException("Some issue with sql syntax.", e);
			} 
			catch (ClassNotFoundException e) 
			{
				  throw new ServletException("JDBC Driver not found.", e);
			}
			finally 
			{
				try 
				{
					if(rs != null) 
					{
						rs.close();
						rs = null;
					}
					if(stmt != null)
					{
						stmt.close();
						stmt = null;
					}
					if(con != null)
					{
						con.close();
						con = null;
					}
				}
				catch (SQLException e) 
				{
					
				}
			}		
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	throws ServletException,IOException
	{

				
		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		
		// connecting to database
		Connection con = null;    
		Statement stmt = null;
		ResultSet rs = null;
	
		String p_name = req.getParameter("name");
		String p_working = req.getParameter("working");
		String p_language = req.getParameter("language"); 
		String p_topoformat = req.getParameter("topoFormat");
		
		this.readConfigProperties();
		
		try 
		{
			Class.forName("com.mysql.jdbc.Driver");
			con = DriverManager.getConnection ("jdbc:mysql://" + this.server +"/topoviz", this.uname, this.passwd);
			stmt = con.createStatement();
		   
			String query;
			
			query = "SELECT * from wirings WHERE name='" + p_name + "' AND language='"+ p_language +"'";
			
			int row_count = 0;
			
			rs = stmt.executeQuery(query);
			
			if(rs.next())
			{
				row_count++;
			}
			if(row_count > 0)
			{
				query = "UPDATE wirings SET working='"+p_working+"' where name='"+ p_name +"' AND language='"+ p_language +"'";			
			}
			else
			{
				query = "INSERT INTO wirings (name,language,working) VALUES ('"+ p_name + "','"+ p_language +"','"+ p_working +"')";
			}
	        
	      	 
	       int count;
	    
	       count = stmt.executeUpdate(query);
	       
//	       if(count > 0 )
//	    	   out.print("true");
	     
	      
	      
	       
	       if(p_topoformat.equals("NMWG Format"))
	       {
	    	   
	    	   ExportNMWG  exp_nmwg = new ExportNMWG(p_name ,p_language , p_working); 
	    	   
	    	   String NMWGContent = exp_nmwg.buildNMWGXML();
	    	   	
	    	   out.print(NMWGContent);
	    	   
	    	   
	       }
	       else if(p_topoformat == "NML Format")
	       {
	    	   out.print("NML Format Unsupported");
	       }
	    	
	       stmt.close ();
	       out.close();
	       
		}
		catch (SQLException e) 
		{
			throw new ServletException("Servlet Could not insert records.", e);
		} 
		catch (ClassNotFoundException e) 
		{
			  throw new ServletException("JDBC Driver not found.", e);
		}
		finally 
		{
			try 
			{
				if(rs != null) 
				{
					rs.close();
					rs = null;
				}
				if(stmt != null)
				{
					stmt.close();
					stmt = null;
				}
				if(con != null)
				{
					con.close();
					con = null;
				}
			}
			catch (SQLException e) 
			{
				
			}
		}
	}
	
	public void readConfigProperties()
	{
		   try {  
    		   InputStream is = new FileInputStream(new File(PROP_FILE));

    		   Properties prop = new Properties();  
    		   prop.load(is);  
    		   this.server = prop.getProperty("server");  
    		   this.uname = prop.getProperty("uname");  
    		   this.passwd = prop.getProperty("passwd");  
               is.close();  
               
               
           } catch (Exception e) {  
        	   System.out.println("Failed to read from " + PROP_FILE + " file.");  
               e.printStackTrace();  
           }  

	}
	
}
